import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';

const PRODUCTION_URL =
  Constants?.expoConfig?.extra?.PRODUCTION_URL || 'https://atplvector.com';
const APP_NAME = Constants?.expoConfig?.extra?.APP_NAME || 'ATPL Vector';

// Primary tabs for one-thumb pilot navigation
const NATIVE_TABS = [
  { id: 'hangar', label: 'Hangar', icon: '✈️', view: 'PLATFORM_DASHBOARD' },
  { id: 'questions', label: 'Questions', icon: '🎯', view: 'QUESTION_BANK' },
  { id: 'study', label: 'Study', icon: '📖', view: 'STUDY_GUIDE' },
  { id: 'planner', label: 'Planner', icon: '📅', view: 'EXAM_PLANNER' },
  { id: 'portal', label: 'Mission', icon: '⚡', action: 'PORTAL' },
];

function isSafeWebUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch (_) {
    return false;
  }
}

const INITIAL_SAFE_METRICS = {
  frame: { x: 0, y: 0, width: 393, height: 852 },
  insets: {
    top: Platform.OS === 'ios' ? 54 : 24,
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? 34 : 0,
  },
};

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={INITIAL_SAFE_METRICS}>
      <MainApp />
    </SafeAreaProvider>
  );
}

function MainApp() {
  const insets = useSafeAreaInsets();
  const topInset = insets.top > 0 ? insets.top : (Platform.OS === 'ios' ? 54 : 0);
  const bottomInset = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'ios' ? 34 : 0);

  const webViewRef = useRef(null);
  const [isConnected, setIsConnected] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);
  const [hasFailedToLoad, setHasFailedToLoad] = useState(false);
  const [activeTab, setActiveTab] = useState('hangar');

  // Injected JavaScript that runs BEFORE any web scripts load
  const injectedBeforeLoad = `
    (function() {
      window.isNativeApp = true;
      window.__NATIVE_PLATFORM__ = 'ios';
      document.documentElement.style.setProperty('--sat', '${topInset}px');
      document.documentElement.style.setProperty('--sab', '${bottomInset}px');
    })();
    true;
  `;

  // Injected JavaScript that runs AFTER DOM is ready to lock viewport, pass safe areas, and disable zoom
  const injectedAfterLoad = `
    (function() {
      window.isNativeApp = true;
      window.__NATIVE_PLATFORM__ = 'ios';
      document.documentElement.style.setProperty('--sat', '${topInset}px');
      document.documentElement.style.setProperty('--sab', '${bottomInset}px');

      // 1. Force strict mobile viewport with viewport-fit=cover
      var meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'viewport';
        document.head.appendChild(meta);
      }
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover';

      // 2. Disable iOS gesture zooming
      document.addEventListener('gesturestart', function(e) { e.preventDefault(); }, { passive: false });
      document.addEventListener('gesturechange', function(e) { e.preventDefault(); }, { passive: false });
      document.addEventListener('gestureend', function(e) { e.preventDefault(); }, { passive: false });

      // 3. Disable double-tap to zoom
      var lastTouchEnd = 0;
      document.addEventListener('touchend', function(e) {
        var now = Date.now();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      }, false);

      // 4. Dispatch native readiness event with hardware safe-area metrics
      window.dispatchEvent(new CustomEvent('nativePlatformReady', { 
        detail: { 
          platform: 'ios', 
          safeArea: { 
            top: ${topInset}, 
            bottom: ${bottomInset} 
          } 
        } 
      }));
    })();
    true;
  `;

  // Synchronize dynamic safe area updates (such as orientation change) into webview
  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        document.documentElement.style.setProperty('--sat', '${topInset}px');
        document.documentElement.style.setProperty('--sab', '${bottomInset}px');
        true;
      `);
    }
  }, [topInset, bottomInset]);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected !== false);
    });
    return () => unsubscribe();
  }, []);

  // Android hardware back button
  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  const handleRetry = () => {
    setHasFailedToLoad(false);
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected !== false);
      setKey((prev) => prev + 1);
    });
  };

  // Handle bidirectional messages from the web study application
  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'HAPTIC') {
        switch (data.hapticType) {
          case 'selection':
            Haptics.selectionAsync();
            break;
          case 'medium':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case 'heavy':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
          case 'success':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case 'warning':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
          case 'error':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
          case 'light':
          default:
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
        }
      } else if (data.type === 'VIEW_CHANGED' && data.view) {
        const matchingTab = NATIVE_TABS.find((t) => t.view === data.view);
        if (matchingTab) {
          setActiveTab(matchingTab.id);
        }
      }
    } catch (_) {}
  };

  // Handle native tab bar selection with Apple Taptic feedback
  const handleTabPress = (tab) => {
    Haptics.selectionAsync();
    setActiveTab(tab.id);

    if (tab.action === 'PORTAL') {
      const js = `window.dispatchEvent(new CustomEvent('togglePortal', { detail: {} })); true;`;
      webViewRef.current?.injectJavaScript(js);
    } else if (tab.view) {
      const js = `window.dispatchEvent(new CustomEvent('nativeNavigate', { detail: { type: 'NAVIGATE', view: '${tab.view}' } })); true;`;
      webViewRef.current?.injectJavaScript(js);
    }
  };

  if (hasFailedToLoad && !isConnected) {
    return (
      <View style={styles.safeArea}>
        <StatusBar style="light" backgroundColor="#030712" translucent />
        <View style={styles.offlineContainer}>
          <View style={styles.offlineIconContainer}>
            <Text style={styles.offlineIcon}>✈️</Text>
          </View>
          <Text style={styles.offlineTitle}>Connection Interrupted</Text>
          <Text style={styles.offlineMessage}>
            Please check your internet connection to continue your ATPL exam preparation.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Calculate bottom tab padding dynamically for all iPhone models
  // iPhone 12 to 18 Pro Max with home indicator will receive 34pt safe inset
  const bottomBarPadding = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'ios' ? 16 : 10);

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#030712" translucent />
      <View style={styles.container}>
        <WebView
          key={key}
          ref={webViewRef}
          source={{ uri: PRODUCTION_URL }}
          style={styles.webview}
          bounces={false}
          decelerationRate="normal"
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          allowsBackForwardNavigationGestures={true}
          originWhitelist={['https://*']}
          applicationNameForUserAgent="ATPLVector-Mobile"
          scalesPageToFit={false}
          pinchGestureEnabled={false}
          allowsLinkPreview={false}
          contentInsetAdjustmentBehavior="never"
          injectedJavaScriptBeforeContentLoaded={injectedBeforeLoad}
          injectedJavaScript={injectedAfterLoad}
          onMessage={handleMessage}
          onShouldStartLoadWithRequest={(request) => isSafeWebUrl(request.url)}
          onError={() => setHasFailedToLoad(true)}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
            setIsLoading(navState.loading);
          }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <Image
              source={require('./assets/splash-icon.png')}
              style={styles.loadingLogo}
              resizeMode="contain"
            />
            <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 24 }} />
            <Text style={styles.loadingText}>Loading ATPL Vector...</Text>
          </View>
        )}

        {/* Native iOS Bottom Tab Navigation Bar */}
        <View style={[styles.bottomBar, { paddingBottom: bottomBarPadding }]}>
          {NATIVE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => handleTabPress(tab)}
                style={styles.tabButton}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.tabIconContainer,
                    isActive && styles.tabIconContainerActive,
                  ]}
                >
                  <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                    {tab.icon}
                  </Text>
                </View>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
                {isActive && <View style={styles.activePill} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#030712',
  },
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  webview: {
    flex: 1,
    backgroundColor: '#030712',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#030712',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingLogo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    letterSpacing: 0.5,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(10, 15, 30, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  tabIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabIconContainerActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  tabIcon: {
    fontSize: 18,
  },
  tabIconActive: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  activePill: {
    position: 'absolute',
    top: 0,
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#38BDF8',
  },
  offlineContainer: {
    flex: 1,
    backgroundColor: '#030712',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  offlineIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  offlineIcon: {
    fontSize: 36,
  },
  offlineTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
    textAlign: 'center',
  },
  offlineMessage: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  retryButton: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
