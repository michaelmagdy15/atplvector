const path = require('path');
const fs = require('fs');

const playwrightPath = 'C:/Users/Mi5a/.codex/skills/gstack/gstack-source/node_modules/playwright';
const { chromium } = require(playwrightPath);

const SCREENSHOT_DIR = path.resolve(__dirname, '../audit_screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const TARGET_URL = process.env.AUDIT_URL || process.argv[2] || 'https://atplvector.com';
const ARTIFACT_DIR = 'C:/Users/Mi5a/.gemini/antigravity/brain/ffb1a42b-50b6-40e7-9535-4e3b2e155791/audit_screenshots';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

const auditLog = {
  timestamp: new Date().toISOString(),
  target: TARGET_URL,
  consoleLogs: [],
  consoleErrors: [],
  issuesDetected: [],
  screenshotsTaken: []
};

function saveScreenshot(filename, buffer) {
  fs.writeFileSync(path.join(SCREENSHOT_DIR, filename), buffer);
  try {
    fs.writeFileSync(path.join(ARTIFACT_DIR, filename), buffer);
  } catch (e) {}
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkHorizontalOverflow(page, viewName) {
  const overflow = await page.evaluate(() => {
    const bodyWidth = document.body.scrollWidth;
    const windowWidth = window.innerWidth;
    const badElements = [];
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > windowWidth + 2) {
        badElements.push({
          tag: el.tagName,
          className: el.className ? String(el.className).slice(0, 80) : '',
          right: Math.round(rect.right),
          windowWidth
        });
      }
    });

    return {
      hasOverflow: bodyWidth > windowWidth + 2,
      bodyWidth,
      windowWidth,
      elementsCount: badElements.length,
      sampleBadElements: badElements.slice(0, 3)
    };
  });

  if (overflow.hasOverflow) {
    auditLog.issuesDetected.push({
      view: viewName,
      type: 'HORIZONTAL_OVERFLOW',
      detail: `Page body scrollWidth (${overflow.bodyWidth}px) exceeds viewport width (${overflow.windowWidth}px)`,
      samples: overflow.sampleBadElements
    });
    console.warn(`[AUDIT WARNING] Horizontal overflow in ${viewName}: ${overflow.bodyWidth}px > ${overflow.windowWidth}px`);
  }
}

async function auditTouchTargets(page, viewName) {
  const smallTargets = await page.evaluate(() => {
    const clickable = Array.from(document.querySelectorAll('button, a, input, select, [role="button"]'));
    const small = [];
    for (const el of clickable) {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) continue;
      if (rect.bottom < 0 || rect.top > window.innerHeight) continue;

      if (rect.width < 40 || rect.height < 40) {
        small.push({
          text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30),
          tag: el.tagName,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          classes: el.className ? String(el.className).slice(0, 60) : ''
        });
      }
    }
    return small.slice(0, 8);
  });

  if (smallTargets.length > 0) {
    auditLog.issuesDetected.push({
      view: viewName,
      type: 'SMALL_TOUCH_TARGETS',
      detail: `Found ${smallTargets.length} interactive elements under Apple HIG recommended 44x44px target area`,
      samples: smallTargets
    });
  }
}

async function navigateViaBridge(page, targetView) {
  await page.evaluate((v) => {
    window.dispatchEvent(new CustomEvent('nativeNavigate', {
      detail: { type: 'NAVIGATE', view: v }
    }));
  }, targetView);
  await sleep(2000);
}

async function runAudit() {
  console.log('--- Launching Headless Chromium with iPhone 15 Pro Emulation ---');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 393, height: 852 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1 ATPLVector-Mobile'
    });

    await context.addInitScript(() => {
      window.isNativeApp = true;
      window.__NATIVE_PLATFORM__ = 'ios';
      document.addEventListener('DOMContentLoaded', () => {
        document.documentElement.style.setProperty('--sat', '54px');
        document.documentElement.style.setProperty('--sab', '34px');
      });
    });

    const page = await context.newPage();

    page.on('console', msg => {
      const text = msg.text();
      auditLog.consoleLogs.push({ type: msg.type(), text });
      if (msg.type() === 'error') {
        auditLog.consoleErrors.push(text);
        console.error(`[BROWSER CONSOLE ERROR]`, text);
      }
    });

    page.on('pageerror', err => {
      auditLog.consoleErrors.push(err.message);
      console.error(`[BROWSER UNCAUGHT ERROR]`, err.message);
    });

    async function takeScreenshot(p, filename) {
      const buf = await p.screenshot({ fullPage: false });
      saveScreenshot(filename, buf);
      auditLog.screenshotsTaken.push(filename);
    }

    // 1. Landing Screen
    console.log(`[1/10] Navigating to ${TARGET_URL} (Landing & Auth)...`);
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(2000);

    await takeScreenshot(page, '01_auth_screen_iphone.png');
    await checkHorizontalOverflow(page, 'Auth/Landing View');

    // 2. Demo Login
    console.log('[2/10] Logging into Demo Access...');
    const demoButton = page.locator('button:has-text("Demo Access")');
    if (await demoButton.count() > 0) {
      await demoButton.click();
      await sleep(3000);
    }

    // 3. Platform Dashboard (Hangar)
    console.log('[3/10] Inspecting Platform Dashboard / Hangar...');
    await takeScreenshot(page, '02_dashboard_hangar_iphone.png');
    await checkHorizontalOverflow(page, 'Dashboard Hangar View');
    await auditTouchTargets(page, 'Dashboard Hangar View');

    // Scroll down to subject cards
    await page.evaluate(() => window.scrollBy(0, 450));
    await sleep(800);
    await takeScreenshot(page, '03_dashboard_subjects_iphone.png');

    // 4. Enter Subject View (010 Air Law)
    console.log('[4/10] Entering Subject View (010 Air Law)...');
    await navigateViaBridge(page, 'AIR_LAW_HOME');
    await takeScreenshot(page, '04_subject_view_iphone.png');
    await checkHorizontalOverflow(page, 'Subject View (Air Law)');

    // 5. Open Subject Sidebar Drawer
    console.log('[5/10] Testing Subject Sidebar Drawer in Subject...');
    const sidebarToggle = page.locator('button[aria-label="Toggle Subject Sidebar"]');
    if (await sidebarToggle.count() > 0) {
      await sidebarToggle.click();
      await sleep(1200);
      await takeScreenshot(page, '05_sidebar_drawer_iphone.png');

      // Close drawer
      const closeBtn = page.locator('button[aria-label="Close Navigation"], button:has(svg.lucide-x)').first();
      if (await closeBtn.count() > 0) {
        await closeBtn.click();
        await sleep(600);
      }
    }

    // 6. Question Bank View
    console.log('[6/10] Navigating to Question Bank...');
    await navigateViaBridge(page, 'QUESTION_BANK');
    await takeScreenshot(page, '06_question_bank_iphone.png');
    await checkHorizontalOverflow(page, 'Question Bank');
    await auditTouchTargets(page, 'Question Bank');

    // 7. Try starting a test / clicking first subject in QB
    console.log('[7/10] Interacting with Question Bank exam selector...');
    const firstSubjectQB = page.locator('button:has-text("Start"), button:has-text("Practice"), div[class*="cursor-pointer"]:has-text("Air Law")').first();
    if (await firstSubjectQB.count() > 0) {
      await firstSubjectQB.click();
      await sleep(2000);
      await takeScreenshot(page, '07_active_question_iphone.png');
    }

    // 8. Study Guide View
    console.log('[8/10] Navigating to Study Guide...');
    await navigateViaBridge(page, 'STUDY_GUIDE');
    await takeScreenshot(page, '08_study_guide_iphone.png');
    await checkHorizontalOverflow(page, 'Study Guide');

    // 9. Exam Planner View
    console.log('[9/10] Navigating to Exam Planner...');
    await navigateViaBridge(page, 'EXAM_PLANNER');
    await takeScreenshot(page, '09_exam_planner_iphone.png');
    await checkHorizontalOverflow(page, 'Exam Planner');

    // 10. Flashcards View
    console.log('[10/10] Navigating to Flashcards...');
    await navigateViaBridge(page, 'FLASHCARDS');
    await takeScreenshot(page, '10_flashcards_iphone.png');
    await checkHorizontalOverflow(page, 'Flashcards');

    // 11. iPad Air Emulation
    console.log('Testing iPad Air Viewport (820x1180)...');
    const ipadContext = await browser.newContext({
      viewport: { width: 820, height: 1180 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1 ATPLVector-Mobile'
    });

    await ipadContext.addInitScript(() => {
      window.isNativeApp = true;
      window.__NATIVE_PLATFORM__ = 'ios';
      document.addEventListener('DOMContentLoaded', () => {
        document.documentElement.style.setProperty('--sat', '24px');
        document.documentElement.style.setProperty('--sab', '24px');
      });
    });

    const ipadPage = await ipadContext.newPage();
    await ipadPage.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
    const ipadDemo = ipadPage.locator('button:has-text("Demo Access")');
    if (await ipadDemo.count() > 0) {
      await ipadDemo.click();
      await sleep(2500);
    }

    await takeScreenshot(ipadPage, '10_dashboard_ipad.png');

    await navigateViaBridge(ipadPage, 'QUESTION_BANK');
    await takeScreenshot(ipadPage, '11_question_bank_ipad.png');

    await ipadContext.close();
    await context.close();

    const reportPath = path.join(SCREENSHOT_DIR, 'audit_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(auditLog, null, 2), 'utf8');
    console.log('--- Full Mobile Audit Completed Successfully ---');
  } catch (err) {
    console.error('Audit encountered error:', err);
  } finally {
    await browser.close();
  }
}

runAudit();
