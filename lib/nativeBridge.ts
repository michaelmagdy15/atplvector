/**
 * Bidirectional Native Bridge for ATPL Vector iOS App
 *
 * Communicates with the native iOS shell (React Native / Expo WKWebView)
 * to trigger hardware Apple Taptic Engine feedback and synchronize navigation state.
 */

export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection'
  | 'success'
  | 'warning'
  | 'error';

/**
 * Triggers physical Apple Taptic Engine feedback on the device.
 * Gracefully does nothing if running in a standard web browser.
 */
export function triggerHaptic(type: HapticType = 'light'): void {
  if (typeof window === 'undefined') return;

  try {
    const postMessage = (window as any).ReactNativeWebView?.postMessage;
    if (typeof postMessage === 'function') {
      postMessage(JSON.stringify({ type: 'HAPTIC', hapticType: type }));
    } else if (navigator.vibrate && type === 'selection') {
      // Basic fallback for browsers supporting navigator.vibrate
      navigator.vibrate(10);
    }
  } catch (_) {
    // Fail silently in non-native environments
  }
}

/**
 * Notifies the native iOS bottom tab bar of the current view
 * so the active tab icon updates in real-time.
 */
export function notifyNativeViewChange(view: string): void {
  if (typeof window === 'undefined') return;

  try {
    const postMessage = (window as any).ReactNativeWebView?.postMessage;
    if (typeof postMessage === 'function') {
      postMessage(JSON.stringify({ type: 'VIEW_CHANGED', view }));
    }
  } catch (_) {}
}

/**
 * Registers a listener for navigation events triggered from the native iOS bottom tab bar.
 */
export function registerNativeNavListener(callback: (view: string) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (event: any) => {
    try {
      let data = event.detail;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      if (data && data.type === 'NAVIGATE' && data.view) {
        callback(data.view);
      }
    } catch (_) {}
  };

  window.addEventListener('nativeNavigate' as any, handler);
  return () => window.removeEventListener('nativeNavigate' as any, handler);
}
