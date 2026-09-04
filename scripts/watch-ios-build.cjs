#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// ATPL Vector — Live iOS Build Monitor
// Polls GitHub Actions API and shows real-time step progress.
//
// Usage:
//   node scripts/watch-ios-build.cjs              # watch latest run
//   node scripts/watch-ios-build.cjs <run-id>     # watch specific run
//   node scripts/watch-ios-build.cjs --trigger     # trigger new build & watch
// ─────────────────────────────────────────────────────────────
const https = require('https');
const { execSync } = require('child_process');

const REPO = 'michaelmagdy15/atplvector';
const WORKFLOW_FILE = 'ios-build.yml';
const POLL_INTERVAL_MS = 15_000; // 15 seconds

// ── GitHub API helper ──────────────────────────────────────
function ghApi(path) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.github.com',
      path,
      headers: {
        'User-Agent': 'atpl-vector-build-monitor',
        'Accept': 'application/vnd.github+json',
      },
    };

    // Use GITHUB_TOKEN if available for authenticated requests (higher rate limit)
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (token) {
      opts.headers['Authorization'] = `Bearer ${token}`;
    }

    https.get(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`GitHub API ${res.statusCode}: ${data.substring(0, 200)}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`JSON parse error: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

// ── Status icons ───────────────────────────────────────────
function stepIcon(status, conclusion) {
  if (status === 'completed') {
    if (conclusion === 'success') return '✅';
    if (conclusion === 'failure') return '❌';
    if (conclusion === 'skipped') return '⏭️';
    if (conclusion === 'cancelled') return '🚫';
    return '⚪';
  }
  if (status === 'in_progress') return '⏳';
  if (status === 'queued') return '🔲';
  return '⬜';
}

function jobIcon(status, conclusion) {
  if (status === 'completed') {
    if (conclusion === 'success') return '🟢';
    if (conclusion === 'failure') return '🔴';
    if (conclusion === 'skipped') return '⏭️';
    return '⚪';
  }
  if (status === 'in_progress') return '🟡';
  if (status === 'queued') return '🔵';
  return '⬜';
}

function duration(startISO, endISO) {
  if (!startISO) return '';
  const start = new Date(startISO);
  const end = endISO ? new Date(endISO) : new Date();
  const diffSec = Math.round((end - start) / 1000);
  if (diffSec < 60) return `${diffSec}s`;
  const m = Math.floor(diffSec / 60);
  const s = diffSec % 60;
  return `${m}m${s}s`;
}

// ── Clear terminal and render ──────────────────────────────
function render(run, jobs) {
  // Clear screen
  process.stdout.write('\x1B[2J\x1B[0f');

  const runIcon = run.conclusion === 'success' ? '🟢'
    : run.conclusion === 'failure' ? '🔴'
    : run.status === 'in_progress' ? '🟡'
    : '🔵';

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║       📱 ATPL Vector — Live iOS Build Monitor           ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  ${runIcon} Run #${run.run_number} — ${run.display_title || run.head_commit?.message || ''}`);
  console.log(`     Branch: ${run.head_branch}  |  SHA: ${run.head_sha?.substring(0, 7)}`);
  console.log(`     Status: ${run.status}${run.conclusion ? ` (${run.conclusion})` : ''}`);
  console.log(`     Duration: ${duration(run.run_started_at, run.updated_at)}`);
  console.log(`     URL: ${run.html_url}`);
  console.log('');

  for (const job of jobs) {
    const icon = jobIcon(job.status, job.conclusion);
    const dur = duration(job.started_at, job.completed_at);
    console.log(`  ${icon} ${job.name} ${dur ? `(${dur})` : ''}`);

    if (job.steps) {
      for (const step of job.steps) {
        // Skip internal steps like "Set up job", "Post ...", "Complete job"
        if (step.name === 'Set up job' || step.name === 'Complete job') continue;
        if (step.name.startsWith('Post ')) continue;

        const sIcon = stepIcon(step.status, step.conclusion);
        const sDur = duration(step.started_at, step.completed_at);
        console.log(`     ${sIcon} ${step.name} ${sDur ? `(${sDur})` : ''}`);
      }
    }
    console.log('');
  }

  // Footer
  const now = new Date().toLocaleTimeString();
  console.log(`  ⏱️  Last updated: ${now}  |  Polling every ${POLL_INTERVAL_MS / 1000}s`);
  console.log(`  Press Ctrl+C to stop watching`);
  console.log('');
}

// ── Trigger workflow dispatch ──────────────────────────────
async function triggerBuild() {
  console.log('🚀 Triggering workflow_dispatch...');
  try {
    execSync(`gh workflow run "${WORKFLOW_FILE}" --ref main`, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });
    console.log('✅ Workflow triggered. Waiting for it to appear...');
    // Wait a few seconds for GitHub to register the run
    await new Promise((r) => setTimeout(r, 5000));
  } catch (e) {
    console.error('❌ Failed to trigger workflow. Make sure `gh` CLI is authenticated.');
    console.error('   Run: gh auth login');
    process.exit(1);
  }
}

// ── Fetch latest run ───────────────────────────────────────
async function getLatestRun() {
  const data = await ghApi(`/repos/${REPO}/actions/workflows/${WORKFLOW_FILE}/runs?per_page=1&branch=main`);
  if (!data.workflow_runs || data.workflow_runs.length === 0) {
    throw new Error('No workflow runs found');
  }
  return data.workflow_runs[0];
}

async function getRunById(runId) {
  return await ghApi(`/repos/${REPO}/actions/runs/${runId}`);
}

async function getJobs(runId) {
  const data = await ghApi(`/repos/${REPO}/actions/runs/${runId}/jobs`);
  return data.jobs || [];
}

async function getAnnotations(checkRunId) {
  try {
    const data = await ghApi(`/repos/${REPO}/check-runs/${checkRunId}/annotations`);
    return data || [];
  } catch {
    return [];
  }
}

// ── Main loop ──────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  let runId = null;

  // Handle --trigger flag
  if (args.includes('--trigger')) {
    await triggerBuild();
  }

  // Handle explicit run ID
  const numericArg = args.find((a) => /^\d+$/.test(a));
  if (numericArg) {
    runId = numericArg;
  }

  let lastConclusion = null;
  let failureReported = false;

  console.log('🔍 Looking for workflow run...');

  while (true) {
    try {
      const run = runId ? await getRunById(runId) : await getLatestRun();
      runId = run.id; // lock to this run

      const jobs = await getJobs(run.id);
      render(run, jobs);

      // Check for completion
      if (run.status === 'completed' && lastConclusion !== run.conclusion) {
        lastConclusion = run.conclusion;

        if (run.conclusion === 'success') {
          console.log('  🎉 BUILD SUCCEEDED! Your app should be on its way to TestFlight.');
          console.log('');
          process.exit(0);
        }

        if (run.conclusion === 'failure' && !failureReported) {
          failureReported = true;
          console.log('  ❌ BUILD FAILED — Fetching error details...');
          console.log('');

          // Find the failed job and get annotations
          for (const job of jobs) {
            if (job.conclusion === 'failure') {
              console.log(`  Failed job: ${job.name}`);
              console.log(`  URL: ${job.html_url}`);

              // Show failed steps
              const failedSteps = (job.steps || []).filter((s) => s.conclusion === 'failure');
              for (const step of failedSteps) {
                console.log(`  ❌ Failed step: ${step.name}`);
              }

              // Try to get annotations
              const annotations = await getAnnotations(job.id);
              if (annotations.length > 0) {
                console.log('');
                console.log('  📝 Error annotations:');
                for (const ann of annotations) {
                  const level = ann.annotation_level === 'failure' ? '❌' : '⚠️';
                  console.log(`     ${level} ${ann.message}`);
                }
              }
            }
          }

          console.log('');
          console.log('  Continuing to monitor in case of re-run...');
          console.log('');
        }
      }

      // Reset failure tracking if run is no longer completed (re-run)
      if (run.status !== 'completed') {
        lastConclusion = null;
        failureReported = false;
      }
    } catch (err) {
      console.error(`⚠️ Error polling: ${err.message}`);
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
