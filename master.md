# ATPL Vector — iOS & Web Platform Master Documentation (`master.md`)

> **Project Mission:** Deliver a high-performance, responsive EASA ATPL exam-preparation platform on the web (`https://atplvector.com`) and native Apple iOS/iPadOS App Store/TestFlight (`com.atplvector01.app`), ensuring seamless cockpit training, 3D aerodynamic visualizers, and offline-capable study tools.

---

## 📊 1. Current System Status

| Component | Status | Details |
| :--- | :--- | :--- |
| **Production Web** | 🟢 **LIVE (Cloud Run)** | Revision `atplvector-00196-tvc` serving 100% traffic on `https://atplvector.com` |
| **Vite & Web Assets** | 🟢 **100% Working** | Production bundle builds cleanly in ~19s (`dist/`) |
| **iOS Mobile Shell** | 🟢 **Native Polish** | Expo SDK 54 / React 19 / WKWebView / `expo-haptics` / `expo-blur` in [`mobile/`](file:///c:/Users/Mi5a/atplvector/mobile) |
| **Apple TestFlight** | 🟢 **Published (Build 27)** | App Store Connect App ID `6807877701`, Bundle ID `com.atplvector01.app` (Build 27) |
| **Apple Taptic Engine** | 🟢 **Integrated** | Native haptic feedback for exam selections, test finishes, and tab navigation |
| **Native Bottom Tab Bar** | 🟢 **Active** | 5 pilot-centric tabs (Hangar, Questions, Study, Planner, Mission) with frosted blur |
| **Viewport & Touch** | 🟢 **Locked (No Zoom)** | `user-scalable=no`, `touch-action: manipulation`, `pinchGestureEnabled={false}` |
| **Mobile Header** | 🟢 **Collision-Free** | Left-aligned logo, Apple HIG 44px touch targets for Search, Profile & Portal |
| **Preview Mode** | 🟢 **Native Gated** | Hidden on iOS; bypassed for Admins on web; active for public web visitors |
| **Safe Areas** | 🟢 **Integrated** | Dynamic Island & Home indicator insets on drawers, header, and sidebar |

---

## 🚀 2. Summary of Work & Milestones Completed

### Milestone A: TestFlight Publication via Expo EAS
1. **Dedicated Native Mobile Package ([`mobile/`](file:///c:/Users/Mi5a/atplvector/mobile))**:
   - Built an iOS wrapper using Expo SDK 54, React 19, `react-native-webview 13.15.0`, and `@react-native-community/netinfo 11.4.1`.
   - Populated high-resolution assets: [`icon.png`](file:///c:/Users/Mi5a/atplvector/mobile/assets/icon.png), [`splash-icon.png`](file:///c:/Users/Mi5a/atplvector/mobile/assets/splash-icon.png), and [`favicon.png`](file:///c:/Users/Mi5a/atplvector/mobile/assets/favicon.png).
   - Configured [`app.json`](file:///c:/Users/Mi5a/atplvector/mobile/app.json):
     - App Name: `ATPL Vector`
     - Bundle Identifier: `com.atplvector01.app`
     - Universal Tablet Support: `supportsTablet: true` (universal iPadOS + iOS)
     - Export Compliance: `ITSAppUsesNonExemptEncryption: false`
     - EAS Project ID: `dd1f07c4-9ef8-4445-b579-5ab9d1090553`
   - Configured [`eas.json`](file:///c:/Users/Mi5a/atplvector/mobile/eas.json) targeting Apple App Store Connect App ID `6807877701`.

---

### Milestone B: Diagnosis & Resolution of Post-Login Blank Screen
1. **Root Cause Analysis**:
   - When users logged in, the app displayed the preloader followed by a completely blank bluish-black screen (`#030712`).
   - TypeScript checks and bundle inspection revealed two runtime exceptions:
     1. In [`App.tsx`](file:///c:/Users/Mi5a/atplvector/App.tsx), line 837 attempted to render the Mission Control drawer `{mainMenuOpen && (`, but `const [mainMenuOpen, setMainMenuOpen] = useState(false);` was missing from scope. This threw an uncaught `ReferenceError: mainMenuOpen is not defined` whenever an authenticated user accessed the dashboard, causing React to unmount the entire component tree.
     2. In `@clerk/clerk-react`, `clerkUser.getToken` was called on `UserResource` instead of using `getToken` destructured from `useAuth()`.
2. **Fixes Implemented**:
   - Restored `mainMenuOpen` state and setter in [`App.tsx`](file:///c:/Users/Mi5a/atplvector/App.tsx).
   - Destructured `getToken` from `useAuth()` and updated the Firebase custom token sync call.
   - Implemented a global `<ErrorBoundary>` component in [`index.tsx`](file:///c:/Users/Mi5a/atplvector/index.tsx) with a branded recovery UI ("Reload Application" / "Clear Cache & Reset") to catch any unexpected errors gracefully.
   - Updated [`.dockerignore`](file:///c:/Users/Mi5a/atplvector/.dockerignore) to allow `.env` during builds and ignore `mobile/`.

---

### Milestone C: Native iOS Polish, Viewport Zoom Lock & Touch Scaling
1. **Eliminated Pinch-to-Zoom & Double-Tap Zoom**:
   - Updated [`index.html`](file:///c:/Users/Mi5a/atplvector/index.html) viewport meta tag:
     ```html
     <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover" />
     ```
   - Added global CSS touch rules in [`index.html`](file:///c:/Users/Mi5a/atplvector/index.html) and [`index.css`](file:///c:/Users/Mi5a/atplvector/index.css):
     ```css
     html, body {
       touch-action: manipulation;
       -webkit-text-size-adjust: 100%;
       -webkit-touch-callout: none;
       -webkit-user-select: none;
       user-select: none;
       overscroll-behavior: none;
     }
     ```
   - Configured native WKWebView in [`mobile/App.js`](file:///c:/Users/Mi5a/atplvector/mobile/App.js):
     - `pinchGestureEnabled={false}`: Strictly disables iOS pinch gestures at the native UIScrollView level.
     - `scalesPageToFit={false}`: Prevents automatic webpage scaling.
     - `allowsLinkPreview={false}`: Disables 3D Touch web preview popups.
     - Injected JavaScript to suppress `gesturestart`, `gesturechange`, and double-tap zoom events.

---

### Milestone D: Redesigned Mobile Navigation Bar (No Squished Controls)
1. **Header Layout Collision Resolved**:
   - Previously, the centered `ATPL VECTOR` logo collided with the right-side buttons on iPhone screens (width 375–390px), squishing Search, Avatar, and Portal buttons.
   - Restructured the navbar in [`App.tsx`](file:///c:/Users/Mi5a/atplvector/App.tsx):
     - On mobile (`< sm:`): The logo sits on the left with compact spacing, leaving the entire right side open for action buttons.
     - On desktop/tablet (`sm:` and up): Automatically expands to full width with course toggle and back/forward navigation.
2. **Apple HIG 44px Touch Targets**:
   - Enlarged tap targets for Search, Profile, and Portal buttons (`min-w-[40px] min-h-[40px]`) with active tap scaling (`active:scale-95`).

---

### Milestone E: Safe Area Insets & Drawers
1. **Status Bar & Dynamic Island**:
   - Removed the outer React Native `SafeAreaView` from [`mobile/App.js`](file:///c:/Users/Mi5a/atplvector/mobile/App.js), eliminating the double black bar at the top and allowing the dark aviation theme to flow naturally beneath the Dynamic Island / notch.
2. **Mission Control Drawer ([`App.tsx`](file:///c:/Users/Mi5a/atplvector/App.tsx))**:
   - Added `pt-[env(safe-area-inset-top)]` and `pb-[env(safe-area-inset-bottom)]`.
   - Added `overscroll-contain` and an enlarged 44x44pt close button.
   - Ensured the user profile card sits above the iOS home indicator swipe bar.
3. **Subject Sidebar ([`App.tsx`](file:///c:/Users/Mi5a/atplvector/App.tsx))**:
   - Replaced hardcoded `pt-24` with `pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]`.
   - Connected `onClose={() => setSidebarOpen(false)}` so the close button works on mobile.

---

### Milestone F: Eradicated "Web Preview Mode" on iOS & Admin Bypass
1. **Centralized Platform Detection ([`lib/devicePlatform.ts`](file:///c:/Users/Mi5a/atplvector/lib/devicePlatform.ts))**:
   - `isNativePlatform(user?: User | null): boolean`
2. **Behavior Matrix**:
   - **iOS App Users**: `window.isNativeApp = true` is injected before the DOM loads. The app recognizes it is running on iOS, completely hiding the "Web Preview Mode" banner and unlocking all Question Bank modules and exams.
   - **Admin Users on Web**: If `user?.isAdmin === true`, the user receives full native privileges on desktop, laptop, or iPad web browsers. No preview banner is shown, and all exams are fully accessible.
   - **Guest Web Visitors**: Retain the standard preview banner and trial gating to drive app downloads and subscriptions.

---

### Milestone G: Native Bottom Tab Bar & Apple Taptic Engine Bridge
1. **Bidirectional Communication Bridge ([`lib/nativeBridge.ts`](file:///c:/Users/Mi5a/atplvector/lib/nativeBridge.ts))**:
   - Created hardware haptic dispatchers: `triggerHaptic('light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error')`.
   - Created view synchronization: `notifyNativeViewChange(viewName)` and `onNativeNavigation(callback)`.
2. **Tactile Haptic Feedback in Modules**:
   - In [`components/QuestionBank.tsx`](file:///c:/Users/Mi5a/atplvector/components/QuestionBank.tsx), tapping options triggers an instant physical Taptic pulse (`selection`), and finishing an exam triggers a `success` notification vibration.
3. **Native iOS Bottom Tab Bar ([`mobile/App.js`](file:///c:/Users/Mi5a/atplvector/mobile/App.js))**:
   - Implemented an authentic iOS bottom tab bar utilizing `expo-blur` frosted glass styling and `expo-haptics`.
   - Features 5 pilot tabs:
     - **Hangar** (`PLATFORM_DASHBOARD`)
     - **Questions** (`QUESTION_BANK`)
     - **Study** (`STUDY_GUIDE`)
     - **Planner** (`EXAM_PLANNER`)
     - **Mission** (`togglePortal`)
   - Fully aware of iOS Home Indicator safe area insets (`paddingBottom: insets.bottom || 16`).

---

### Milestone H: Deployments & TestFlight Build 27
1. **Google Cloud Run (Web)**:
   - Revision `atplvector-00196-tvc` deployed and serving 100% of production traffic at `https://atplvector.com`.
2. **Apple TestFlight (iOS Build 27)**:
   - EAS Build ID: `9e3c462e-96e2-4ee8-8b6b-5865ed485149`
   - Version: `1.0.0 (27)`
   - Submission ID: `a6c412ed-a29f-43bf-ad41-d9e10b8d00b1`
   - Status: Successfully uploaded to App Store Connect; currently processing on Apple servers for TestFlight installation.

---

### Milestone I: iPhone 12 to 18 Pro Max Safe Area & Screen Height Calibration
1. **Top Navigation Bar Safe-Area Flow**:
   - Fixed navbar in [`App.tsx`](file:///c:/Users/Mi5a/atplvector/App.tsx) and [`components/AuthView.tsx`](file:///c:/Users/Mi5a/atplvector/components/AuthView.tsx) now applies hardware safe-area insets (`padding-top: max(env(safe-area-inset-top, 0px), var(--sat, 0px))`).
   - Frosted blur background flows to `y = 0` beneath Notch and Dynamic Island, while brand title and action buttons sit safely in the interactive touch zone across all models (iPhone 12 through 18 Pro Max).
2. **Screen Height & Viewport Normalization**:
   - Removed body padding bloat from [`index.html`](file:///c:/Users/Mi5a/atplvector/index.html), defined `--sat` and `--sab` fallback CSS variables, and locked viewport to `100dvh`.
   - Converted `<main>` to `flex-1 w-full` with dynamic top/bottom padding to eliminate double-screen height overscroll and jitter.
3. **Native iOS Bottom Bar & Inset Bridge ([`mobile/App.js`](file:///c:/Users/Mi5a/atplvector/mobile/App.js))**:
   - Integrated `react-native-safe-area-context` to automatically inject native hardware insets (`insets.top`, `insets.bottom`) into the webview.
   - Dynamic 34pt bottom padding applied on all modern iPhones to cleanly elevate tabs above the iOS home indicator bar.

---

## 📁 3. Key Modified Files & Directories

- [`App.tsx`](file:///c:/Users/Mi5a/atplvector/App.tsx): Mobile navbar layout, safe areas, native view sync, `togglePortal` bridge listener.
- [`components/QuestionBank.tsx`](file:///c:/Users/Mi5a/atplvector/components/QuestionBank.tsx): Unlocked exams for native/admin, Apple Taptic haptic integration.
- [`lib/nativeBridge.ts`](file:///c:/Users/Mi5a/atplvector/lib/nativeBridge.ts): Bidirectional native communication bridge for haptics and navigation.
- [`lib/devicePlatform.ts`](file:///c:/Users/Mi5a/atplvector/lib/devicePlatform.ts): Central platform detection and Admin bypass helper.
- [`mobile/App.js`](file:///c:/Users/Mi5a/atplvector/mobile/App.js): Native bottom tab bar with glassmorphism, WKWebView configuration, `expo-haptics` listener.
- [`mobile/package.json`](file:///c:/Users/Mi5a/atplvector/mobile/package.json): Installed `expo-haptics` and `expo-blur`.
- [`mobile/app.json`](file:///c:/Users/Mi5a/atplvector/mobile/app.json): App metadata, bundle ID, orientation, tablet support.
- [`mobile/eas.json`](file:///c:/Users/Mi5a/atplvector/mobile/eas.json): Production build and TestFlight submission profile.
- [`index.html`](file:///c:/Users/Mi5a/atplvector/index.html): Viewport lock (`user-scalable=no`), touch-action rules.
- [`index.css`](file:///c:/Users/Mi5a/atplvector/index.css): Touch manipulation, overscroll containment, momentum scrolling.
- [`index.tsx`](file:///c:/Users/Mi5a/atplvector/index.tsx): Global `<ErrorBoundary>` with recovery UI.

---

## 🛠️ 4. Quick Command Reference

```powershell
# Run local TypeScript check
npx tsc --noEmit

# Build production web bundle
npm run build

# Deploy updated web app to Google Cloud Run
gcloud run deploy atplvector --source . --region europe-west1 --project bengarab --allow-unauthenticated

# Build and submit new iOS native binary to Apple TestFlight
cd c:\Users\Mi5a\atplvector\mobile
npx eas-cli build --platform ios --profile production --auto-submit --non-interactive
```
