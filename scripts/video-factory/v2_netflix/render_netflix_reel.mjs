#!/usr/bin/env node
/**
 * Renders the 9:16 (1080x1920 @ 30fps) Netflix Documentary Prototype Reel
 * from Three.js WebGL + DOM Stage (scene_stage.html) + Kokoro/Cinema Audio.
 *
 * Usage:
 *   node render_netflix_reel.mjs --preview
 *   node render_netflix_reel.mjs --render
 */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const OUT_DIR = 'G:\\ATPLVECTOR_Videos\\v2_Netflix';
const WORK_DIR = path.join(OUT_DIR, '_work');
const TIMELINE_PATH = path.join(WORK_DIR, 'timeline.json');
const AUDIO_PATH = path.join(WORK_DIR, 'master_audio.wav');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const W = 1080;
const H = 1920;
const FPS = 30;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

function startStaticServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
      const fullPath = path.join(REPO_ROOT, safePath);
      if (!fullPath.startsWith(REPO_ROOT) || !fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(fullPath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(fullPath).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, port: addr.port });
    });
  });
}

async function run() {
  const args = new Set(process.argv.slice(2));
  const doPreview = args.has('--preview');
  const doRender = args.has('--render');
  if (!doPreview && !doRender) {
    console.error('Pass --preview or --render');
    process.exit(1);
  }

  if (!fs.existsSync(TIMELINE_PATH)) {
    throw new Error(`Missing timeline.json at ${TIMELINE_PATH}. Run audio_engine.py first.`);
  }
  const timeline = JSON.parse(fs.readFileSync(TIMELINE_PATH, 'utf-8'));

  const { server, port } = await startStaticServer();
  const stageUrl = `http://127.0.0.1:${port}/scripts/video-factory/v2_netflix/scene_stage.html`;

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--use-gl=angle',
      '--use-angle=d3d11',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
      `--window-size=${W},${H}`,
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    page.on('pageerror', (e) => console.error('[Stage PageError]', e.message));

    await page.goto(stageUrl, { waitUntil: 'networkidle0' });
    await page.evaluate((tl) => window.initTimeline(tl), timeline);
    await page.waitForFunction(() => window.__STAGE_READY__ === true, { timeout: 15000 });

    const cdp = await page.createCDPSession();

    if (doPreview) {
      const actTimes = [
        timeline.cues.eng_fail + 0.35,                               // Act 1 Engine failure
        timeline.cues.toda_reveal + 0.85,                            // Act 2 3D Diorama
        timeline.cues.v1_collide + 0.45,                             // Act 3 Netflix Evidence + Cursor
        timeline.cues.quiz_2 + 0.15,                                 // Act 4 Interactive Quiz
        timeline.cues.rule_3 + 0.45,                                 // Act 5 Verdict + 3 Rules
        timeline.acts['6'].start + 0.85,                             // Act 6 Outro Logo
      ];
      for (let i = 0; i < actTimes.length; i++) {
        const t = actTimes[i];
        await page.evaluate((sec) => {
          window.renderAtTime(sec);
          return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        }, t);
        const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
        const outP = path.join(OUT_DIR, `act_${i + 1}_preview.png`);
        fs.writeFileSync(outP, Buffer.from(data, 'base64'));
        console.log(`[Preview] Saved act_${i + 1}_preview.png (t=${t.toFixed(2)}s)`);
      }

      // Stitch 3x2 grid via Python/OpenCV for quick single-image inspection
      const pyGrid = spawn('python', [
        '-c',
        `import cv2, numpy as np, pathlib
out = pathlib.Path(r"${OUT_DIR}")
imgs = [cv2.resize(cv2.imread(str(out / f"act_{i}_preview.png")), (360, 640)) for i in range(1, 7)]
grid = np.vstack([np.hstack(imgs[:3]), np.hstack(imgs[3:])])
cv2.imwrite(str(out / "PERF_TAKEOFF_v2_preview.png"), grid)
print("Saved PERF_TAKEOFF_v2_preview.png")`,
      ], { stdio: 'inherit' });
      await new Promise((r, rej) => pyGrid.on('exit', (c) => c === 0 ? r() : rej(new Error(`grid exit ${c}`))));
    }

    if (doRender) {
      const totalDur = timeline.total_duration;
      const totalFrames = Math.ceil(totalDur * FPS);
      const outMp4 = path.join(OUT_DIR, 'PERF_TAKEOFF_v2.mp4');
      const ffmpegLog = path.join(WORK_DIR, 'ffmpeg_v2.log');
      const logFd = fs.openSync(ffmpegLog, 'w');

      console.log(`[Render] Rendering ${totalFrames} frames (${totalDur.toFixed(2)}s @ ${FPS}fps, 1080x1920) via Chrome GPU + NVENC...`);
      const ff = spawn(
        'ffmpeg',
        [
          '-y', '-loglevel', 'warning',
          '-f', 'image2pipe', '-vcodec', 'mjpeg', '-r', String(FPS), '-i', '-',
          '-i', AUDIO_PATH,
          '-c:v', 'h264_nvenc', '-preset', 'p4', '-rc', 'vbr', '-cq', '23', '-b:v', '0', '-pix_fmt', 'yuv420p',
          '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest',
          outMp4,
        ],
        { stdio: ['pipe', 'ignore', logFd] }
      );

      const t0 = Date.now();
      for (let f = 0; f < totalFrames; f++) {
        const t = f / FPS;
        await page.evaluate((sec) => {
          window.renderAtTime(sec);
        }, t);
        const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 94 });
        const buf = Buffer.from(data, 'base64');
        if (!ff.stdin.write(buf)) {
          await new Promise((r) => ff.stdin.once('drain', r));
        }
        if (f % 150 === 0 || f === totalFrames - 1) {
          const el = ((Date.now() - t0) / 1000).toFixed(1);
          console.log(`   Frame ${f + 1}/${totalFrames} (${(((f + 1) / totalFrames) * 100).toFixed(1)}%) | ${el}s`);
        }
      }
      ff.stdin.end();
      const code = await new Promise((r) => ff.on('exit', r));
      fs.closeSync(logFd);
      if (code !== 0) {
        const errText = fs.readFileSync(ffmpegLog, 'utf-8');
        throw new Error(`FFmpeg failed (${code}): ${errText}`);
      }
      const mb = (fs.statSync(outMp4).size / (1024 * 1024)).toFixed(2);
      console.log(`[Render] DONE in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${outMp4} (${mb} MB)`);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
