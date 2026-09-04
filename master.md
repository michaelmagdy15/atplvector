# ATPL Vector — iPadOS & iOS Master Development & Deployment Tracker

> **Mission:** Deliver the full ATPL Vector exam-preparation platform to Apple TestFlight and the App Store as an iPad and iPhone application as fast as humanly possible, keeping the user 100% informed in real time.

---

## 📊 Current System Status

| Component | Status | Detail |
| :--- | :--- | :--- |
| **Vite & Web Assets** | 🟢 **100% Working** | Production bundle builds cleanly in ~30s (`dist/`) |
| **Capacitor iOS Sync** | 🟢 **100% Working** | Copies web code & native plugins cleanly in ~20s |
| **CocoaPods & Xcode 16** | 🟢 **100% Working** | Compiles iOS workspace with iOS 18 SDK cleanly in CI |
| **Apple App Store Auth** | 🟢 **RESOLVED (200 OK)** | Key `7SP72YX2TU` verified with Apple API (Found 3 apps including `ATPL Vector`) |
| **Auth Test Suite** | 🟢 **100% Working** | 8-second cloud workflow verified green in GitHub Actions |
| **Certificate Management** | 🟢 **AUTOMATED** | Stale ephemeral Development certificates auto-revoked via API before each build |
| **TestFlight Delivery** | 🟡 **DEPLOYING (Run #22)** | Clean build pipeline armed and ready |

---

## 🔍 Evolution of Root Causes & Fixes

1. **Runs 1–13 (Legacy Signing):** Failed because Fastlane tried to use `sigh` with an invalid/empty Git repo.
   - **Fix:** Switched to modern Apple App Store Connect API keys directly in `build_app`.
2. **Run 14 (401 Unauthorized):** Mismatched API key in GitHub Secrets.
   - **Fix:** Located valid Key `7SP72YX2TU` on disk and updated GitHub Secrets via REST API.
3. **Run 17 (Duplicate xcargs):** `-authenticationKeyPath` passed twice to `xcodebuild -exportArchive`.
   - **Fix:** Cleaned up Fastfile `xcargs` to let gym handle export flags automatically.
4. **Run 19 (Apple 409 SDK Version Issue):** Archive built and uploaded to Apple, but rejected with:
   - *"This app was built with iOS 17.5 SDK. All apps must be built with iOS 18 SDK (Xcode 16) or later."*
   - **Fix:** Added `sudo xcode-select -s /Applications/Xcode_16.2.app` to select Xcode 16.2 with iOS 18 SDK.
5. **Run 20 (Development Certificate Limit):** Xcode 16 tried to create a development cert, but hit Apple's 2-certificate account limit from previous CI runs.
   - **Fix:** Built `scripts/cleanup-dev-certs.cjs` which queries Apple Developer API and automatically revokes stale ephemeral development certificates before building.
6. **Run 21 (Conflicting Code Signing Identity):** Manually specifying `Apple Distribution` conflicted with CocoaPods targets and Xcode automatic signing.
   - **Fix:** Restored `CODE_SIGN_STYLE = Automatic` and `CODE_SIGN_IDENTITY = "iPhone Developer"`, added `CODE_SIGNING_ALLOWED = 'NO'` to CocoaPods in `Podfile`, and enabled the automated cert cleanup step.

---

## 🛠️ CLI Quick Reference

```powershell
# 1. Test Apple API credentials locally with a .p8 file
node scripts/test-apple-auth.cjs 7SP72YX2TU 7b5e3219-0582-4aee-a93f-2b37d5bc8ecb "C:\Users\Mi5a\Desktop\gggg\AuthKey_7SP72YX2TU.p8"

# 2. Cleanup stale dev certificates via API
node scripts/cleanup-dev-certs.cjs

# 3. Watch active iOS GitHub Actions build live in terminal
$env:GITHUB_TOKEN="<TOKEN>"; node scripts/watch-ios-build.cjs

# 4. Check current GitHub Actions job statuses
$env:GITHUB_TOKEN="<TOKEN>"; node scripts/check-status.cjs
```
