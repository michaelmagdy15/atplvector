import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  BackHandler,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';
import Constants from 'expo-constants';

const PRODUCTION_URL =
  Constants?.expoConfig?.extra?.PRODUCTION_URL || 'https://atplvector.com';
const APP_NAME = Constants?.expoConfig?.extra?.APP_NAME || 'ATPL Vector';

function isSafeWebUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch (_) {
    return false;
  }
}

export default function App() {
  const webViewRef = useRef(null);
  const [isConnected, setIsConnected] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);
  const [hasFailedToLoad, setHasFailedToLoad] = useState(false);

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

  if (hasFailedToLoad && !isConnected) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" backgroundColor="#030712" />
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#030712" />
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
      </View>
    </SafeAreaView>
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
    borderRadius: 40,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  offlineIcon: {
    fontSize: 36,
  },
  offlineTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  offlineMessage: {
    color: '#94A3B8',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
