import { Capacitor } from '@capacitor/core';
import { User } from '../types';

/**
 * Determines whether the current execution context should be treated as native.
 *
 * Rules:
 * 1. Admins ALWAYS receive full native privileges, even when accessing from a standard web browser.
 * 2. Mobile wrapper execution (injected native flags or User Agent) is recognized as native.
 * 3. Capacitor native runtime is recognized as native.
 * 4. Regular web visitors return false (retaining Web Preview Mode and gating).
 */
export function isNativePlatform(user?: User | null): boolean {
  // 1. Admin bypass: Full access everywhere
  if (user?.isAdmin) {
    return true;
  }

  // 2. Direct native shell detection (injected before DOM content loads)
  if (typeof window !== 'undefined') {
    if ((window as any).isNativeApp === true) return true;
    if ((window as any).__NATIVE_PLATFORM__ === 'ios') return true;
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
      if (navigator.userAgent.includes('ATPLVector-Mobile')) return true;
      if (navigator.userAgent.includes('Capacitor')) return true;
    }
  }

  // 3. Capacitor Native runtime check
  try {
    if (Capacitor.isNativePlatform()) return true;
  } catch (_) {
    // Non-capacitor environment fallback
  }

  return false;
}
