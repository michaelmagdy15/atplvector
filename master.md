# 🚀 ATPL Vector — iOS CI/CD & TestFlight Master Tracker

> **Project:** ATPL Vector  
> **Repository:** `michaelmagdy15/atplvector`  
> **Tech Stack:** React 19, Vite, Tailwind CSS, Capacitor 5, Three.js, Spline, Fastlane, GitHub Actions  
> **Target:** Automated build, code signing, and deployment to **Apple TestFlight** & App Store  
> **Last Updated:** September 4, 2026  

---

## 📌 Executive Status Summary

| Area | Status | Notes |
| :--- | :---: | :--- |
| **Vite & Web Assets** | 🟢 **100% Working** | Production bundle builds cleanly in ~30s (`dist/`) |
| **Capacitor iOS Sync** | 🟢 **100% Working** | Copies web code & native plugins cleanly in ~20s |
| **CocoaPods & Xcode** | 🟢 **100% Working** | Compiles iOS workspace & produces `.xcarchive` cleanly in CI |
| **Live Build Monitor** | 🟢 **100% Working** | Real-time CLI & API log inspect tools created |
| **Auth Test Suite** | 🟢 **100% Working** | 8-second cloud workflow & local script created to test Apple API |
| **Apple App Store Auth** | 🔴 **Blocked (401)** | Apple API returns `401 NOT_AUTHORIZED` on stored credentials |
| **TestFlight Delivery** | ⏳ **Awaiting Auth** | Ready to deploy as soon as valid Apple API key is authenticated |

---

## ✅ What Has Been Done

### 1. Fixed CI Architecture & Runner Environments
- **Node.js 22 Upgrade:** Fixed deprecation issues on macOS runners by enforcing Node.js 22 in GitHub Actions.
- **Submodule Handling:** Resolved submodule git warnings during checkout.
- **Two-Stage Pipeline:** Divided CI into:
  - **Job 1 (`build-ios`):** Builds Vite web bundle, syncs with Capacitor iOS, installs CocoaPods, compiles Xcode workspace, and packages the iOS archive.
  - **Job 2 (`release-testflight`):** Runs on macOS-14 to sign the build with App Store Connect credentials and upload to TestFlight via Fastlane.

### 2. Fastlane & Signing Configuration Modernization
- **Eliminated Broken Legacy Signing:** Removed obsolete `sigh` / git-based Match certificate repos that caused clone failures in past runs.
- **Migrated to Apple App Store Connect API:**
  - Configured `app_store_connect_api_key` in [ios/App/fastlane/Fastfile](file:///c:/Users/Mi5a/Documents/atplvector/ios/App/fastlane/Fastfile).
  - Configured automatic signing in `build_app` (`gym`) with cloud profile provisioning.
  - Integrated `agvtool` to automatically set `CURRENT_PROJECT_VERSION` and `CFBundleVersion` equal to the GitHub Actions run number so TestFlight never rejects duplicate build numbers.

### 3. Monitoring & Diagnostic Tooling Created
- **`scripts/watch-ios-build.cjs`**: Real-time terminal monitor that polls GitHub Actions API and displays live step-by-step checkmarks, timing, and direct URLs.
- **`scripts/test-apple-auth.cjs`**: Lightweight script to verify Apple App Store Connect API keys locally or in CI without building the entire app.
- **`.github/workflows/test-apple-auth.yml`**: Dedicated 8-second cloud test workflow in GitHub Actions to test GitHub secrets against Apple's live API on an Ubuntu runner.
- **`scripts/check-status.cjs` & `scripts/get-job-logs.cjs`**: Automated tools to fetch full raw logs from GitHub Actions jobs for instant root-cause analysis.

---

## 🔍 Root Cause Analysis of Current Blocker

### The Issue: Apple HTTP 401 (Unauthorized)
When GitHub Actions runs the TestFlight upload, Apple rejects the App Store Connect credentials:

```json
⚠️ Apple API responded with HTTP 401:
{
  "status": "401",
  "code": "NOT_AUTHORIZED",
  "title": "Authentication credentials are missing or invalid.",
  "detail": "Provide a properly configured and signed bearer token, and make sure that it has not expired."
}
```

### Why This Happens (4 Possibilities in Apple Developer Accounts):
1. **Unaccepted Apple Agreements (Most Common):** Whenever Apple updates their Developer Program License Agreement, all API keys are temporarily suspended until the Account Holder clicks "Review Agreement" and "Agree" at [developer.apple.com/account](https://developer.apple.com/account).
2. **Key ID & Private Key Mismatch:** If multiple `.p8` files were generated, the Key ID in GitHub Secrets must match the exact `.p8` file downloaded.
3. **Issuer ID Error:** The Issuer ID must match the organization Issuer ID GUID displayed at the top of the App Store Connect Keys tab.
4. **Key Role / Permissions:** The key must have the **Admin** or **App Manager** role to generate distribution provisioning profiles and upload to TestFlight.

---

## 📋 What Needs To Be Done (Action Plan)

- [ ] **Step 1: Verify Apple Developer Account Status**
  - Sign in to **[developer.apple.com/account](https://developer.apple.com/account)** and **[appstoreconnect.apple.com](https://appstoreconnect.apple.com)**.
  - Check for any red banner or notification requiring agreement acceptance. Accept if present.
- [ ] **Step 2: Generate or Confirm App Store Connect API Key**
  - Go to **[App Store Connect -> Users and Access -> Integrations -> App Store Connect API](https://appstoreconnect.apple.com/access/integrations/api)**.
  - Click **`+`** to generate a clean key (Name: `CI TestFlight`, Access: **Admin**).
  - Copy **Key ID**, **Issuer ID**, and download the `AuthKey_XXXX.p8` file.
- [ ] **Step 3: Update GitHub Repository Secrets**
  - In GitHub repository **Settings -> Secrets and variables -> Actions**, update:
    - `APP_STORE_CONNECT_API_KEY_ID`
    - `APP_STORE_CONNECT_ISSUER_ID`
    - `APP_STORE_CONNECT_PRIVATE_KEY` (paste the full `.p8` content including `BEGIN` and `END` lines).
- [ ] **Step 4: Run Fast Verification**
  - Trigger `.github/workflows/test-apple-auth.yml` (takes ~8 seconds).
  - Confirm output is `🎉 SUCCESS! Apple authenticated with HTTP 200 OK`.
- [ ] **Step 5: Trigger Full Production TestFlight Build**
  - Push or trigger `.github/workflows/ios-build.yml`.
  - Monitor live build with `node scripts/watch-ios-build.cjs`.
- [ ] **Step 6: Confirm TestFlight Availability**
  - Open App Store Connect -> TestFlight tab and verify Build #15+ is processing/ready for internal testing.

---

## 🛠️ CLI Quick Reference

```powershell
# 1. Test Apple API credentials locally with a .p8 file
node scripts/test-apple-auth.cjs <KEY_ID> <ISSUER_ID> "C:\path\to\AuthKey_XXXX.p8"

# 2. Watch active iOS GitHub Actions build live in terminal
node scripts/watch-ios-build.cjs

# 3. Check current GitHub Actions job statuses
node scripts/check-status.cjs

# 4. Fetch raw logs of a specific GitHub Actions job ID
$env:GITHUB_TOKEN="<YOUR_TOKEN>"; node scripts/get-job-logs.cjs <JOB_ID>
```
