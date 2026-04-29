#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * scan_coverage.mjs
 *
 * Scans the ATPL Vector repo for references to EASA Learning Objective IDs
 * (e.g. 010.01.01.01) and produces a coverage report.
 *
 * Usage (from repo root):
 *   node scan_coverage.mjs                                # scans current dir
 *   node scan_coverage.mjs --root .                       # explicit root
 *   node scan_coverage.mjs --syllabus syllabus_canonical.json
 *   node scan_coverage.mjs --supabase                     # also query Supabase (needs env vars)
 *
 * Outputs:
 *   coverage_scan.csv            one row per LO_ID  (paste into tracker)
 *   coverage_summary.json        per-subject rollup with counts
 *
 * Required: syllabus_canonical.json (place at repo root, or pass --syllabus)
 *
 * What counts as "covered":
 *   A leaf LO is considered covered if its full LO_ID appears as a
 *   string literal in any TS/TSX/JS/JSON/MD file under SCAN_DIRS.
 *   This is intentionally simple — content-quality judgement is OUT of
 *   scope for the scanner. Mark Coverage_Status manually after review.
 *
 * Optional Supabase check:
 *   If --supabase is passed and SUPABASE_URL + SUPABASE_SERVICE_KEY are set,
 *   the script ALSO queries `lessons` (or whichever table you set with
 *   --table) for rows whose `lo_id` matches and counts them as covered.
 *   Adjust the table and column names below to match your schema.
 */

import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { argv, exit } from 'node:process';

// ---------- config ----------
const SCAN_DIRS = ['components', 'lib', 'services', 'context'];
const SCAN_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.json', '.md', '.txt', '.html']);
const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.cache', 'ios/Pods', 'extracted_notes', 'NewSyllabusTracker']);
const IGNORE_FILES = new Set(['syllabus.json', 'syllabus.csv', 'ATPLSYLLABUS_extracted.txt', 'coverage_scan.csv', 'tk-syllabus-comparison-doc-v6.xlsx', 'atplvector_coverage_tracker.xlsx']);
// LO_ID pattern: leaves are 5-segment (e.g. 050.04.02.03.01).
// Match 5-segment first to avoid swallowing the leaf as a 4-segment topic ID.
// We also capture 4-segment topic IDs separately for diagnostic reporting.
const LO_ID_LEAF_RE  = /\b(\d{3}\.\d{2}\.\d{2}\.\d{2}\.\d{2})\b/g;
const LO_ID_TOPIC_RE = /\b(\d{3}\.\d{2}\.\d{2}\.\d{2})(?!\.\d{2})\b/g;

// ---------- args ----------
const args = Object.fromEntries(
  argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith('--')) {
      const k = cur.slice(2);
      const next = arr[i + 1];
      if (!next || next.startsWith('--')) acc.push([k, true]);
      else acc.push([k, next]);
    }
    return acc;
  }, [])
);

const ROOT = resolve(args.root || '.');
const SYLLABUS = resolve(args.syllabus || join(ROOT, 'syllabus_canonical.json'));
const USE_SUPABASE = !!args.supabase;
const TABLE = args.table || 'lessons';      // change to your table
const ID_COL = args['id-col'] || 'lo_id';    // change to your column

// ---------- main ----------
(async () => {
  // 1. Load canonical syllabus
  let syllabus;
  try {
    syllabus = JSON.parse(await readFile(SYLLABUS, 'utf8'));
  } catch (e) {
    console.error(`ERROR: cannot read syllabus at ${SYLLABUS}`);
    console.error('Pass --syllabus <path> or place syllabus_canonical.json at repo root.');
    exit(1);
  }

  const allLOs = new Map(); // lo_id -> { subject, text, bk, change, priority, hits: [], dbRows: 0 }
  for (const subj of syllabus.subjects) {
    for (const lo of subj.los) {
      if (lo.lo_id.split('.').length !== 5) continue;
      allLOs.set(lo.lo_id, {
        lo_id: lo.lo_id,
        subject: subj.code,
        subject_name: subj.name,
        text: lo.text,
        bk: lo.bk_only,
        change: lo.ecqb_2026_change || '',
        priority: lo.priority || '',
        hits: [],     // file paths where lo_id appears
        dbRows: 0,    // count from supabase if --supabase
      });
    }
  }
  console.log(`Loaded ${allLOs.size} leaf LOs from canonical syllabus.`);

  // 2. Crawl filesystem
  let filesScanned = 0;
  let bytesScanned = 0;
  let topicOnlyHits = 0;   // 4-seg matches that don't resolve to a leaf (informational)
  const scanFile = async (path) => {
    try {
      const buf = await readFile(path, 'utf8');
      filesScanned++;
      bytesScanned += buf.length;
      const seenLeaves = new Set();
      const seenTopics = new Set();
      // Match 5-segment leaves
      for (const m of buf.matchAll(LO_ID_LEAF_RE)) {
        const id = m[1];
        if (seenLeaves.has(id)) continue;
        seenLeaves.add(id);
        const lo = allLOs.get(id);
        if (lo) lo.hits.push(relative(ROOT, path));
      }
      // Match 4-segment topic references (informational only — these are headings, not LOs)
      for (const m of buf.matchAll(LO_ID_TOPIC_RE)) {
        const id = m[1];
        if (seenTopics.has(id)) continue;
        seenTopics.add(id);
        topicOnlyHits++;
      }
    } catch { /* binary or unreadable; skip */ }
  };

  const walk = async (dir) => {
    let entries;
    try { entries = await readdir(dir); } catch { return; }
    for (const name of entries) {
      if (IGNORE_DIRS.has(name) || IGNORE_FILES.has(name) || name.startsWith('.')) continue;
      const full = join(dir, name);
      const st = await stat(full).catch(() => null);
      if (!st) continue;
      if (st.isDirectory()) {
        await walk(full);
      } else {
        const dot = name.lastIndexOf('.');
        const ext = dot >= 0 ? name.slice(dot).toLowerCase() : '';
        if (SCAN_EXTS.has(ext)) await scanFile(full);
      }
    }
  };

  // Scan listed top-level dirs first if they exist; otherwise scan everything
  let scannedAny = false;
  for (const d of SCAN_DIRS) {
    const full = join(ROOT, d);
    const st = await stat(full).catch(() => null);
    if (st && st.isDirectory()) { await walk(full); scannedAny = true; }
  }
  if (!scannedAny) {
    console.log('None of the expected dirs found; scanning entire repo root.');
    await walk(ROOT);
  }
  console.log(`Scanned ${filesScanned} files, ${(bytesScanned/1024/1024).toFixed(1)} MB.`);
  if (topicOnlyHits > 0) {
    console.log(`(Info: found ${topicOnlyHits} references to 4-segment topic IDs — those are headings, not LOs, so they don't count as coverage.)`);
  }

  // 3. Optional Supabase check
  if (USE_SUPABASE) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
    if (!url || !key) {
      console.warn('--supabase set but SUPABASE_URL / SUPABASE_SERVICE_KEY not in env. Skipping DB check.');
    } else {
      console.log(`Querying Supabase: ${TABLE}.${ID_COL} ...`);
      try {
        const r = await fetch(`${url}/rest/v1/${TABLE}?select=${ID_COL}`, {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const rows = await r.json();
        for (const row of rows) {
          const id = row[ID_COL];
          if (allLOs.has(id)) allLOs.get(id).dbRows++;
        }
        console.log(`  fetched ${rows.length} DB rows.`);
      } catch (e) {
        console.warn(`  Supabase query failed: ${e.message}`);
      }
    }
  }

  // 4. Build CSV
  const csvHeader = [
    'LO_ID','Subject','Subject_Name','Priority','BK_Only','ECQB_2026_Change',
    'File_Hits','First_File','DB_Rows','Coverage_Status_Suggested','LO_Text'
  ].join(',');
  const csvRows = [csvHeader];
  const summary = {};

  const csvEsc = (s) => {
    if (s == null) return '';
    const str = String(s);
    return /[",\n\r]/.test(str) ? `"${str.replace(/"/g,'""')}"` : str;
  };

  // Sort by subject then LO_ID
  const sorted = [...allLOs.values()].sort((a,b) =>
    a.subject.localeCompare(b.subject) || a.lo_id.localeCompare(b.lo_id));

  for (const lo of sorted) {
    const fileHits = lo.hits.length;
    const firstFile = lo.hits[0] || '';
    const covered = fileHits > 0 || lo.dbRows > 0;
    const suggested = covered ? 'DRAFT_DONE' : 'NOT_STARTED';
    csvRows.push([
      lo.lo_id, lo.subject, lo.subject_name, lo.priority, lo.bk ? 'Y' : 'N', lo.change,
      fileHits, firstFile, lo.dbRows, suggested, lo.text
    ].map(csvEsc).join(','));

    if (!summary[lo.subject]) {
      summary[lo.subject] = {
        subject: lo.subject, name: lo.subject_name, total: 0, covered: 0,
        not_started: 0, bk_total: 0, bk_covered: 0,
        change_total: 0, change_covered: 0,
      };
    }
    const s = summary[lo.subject];
    s.total++;
    if (covered) s.covered++; else s.not_started++;
    if (lo.bk) { s.bk_total++; if (covered) s.bk_covered++; }
    if (lo.change) { s.change_total++; if (covered) s.change_covered++; }
  }

  await writeFile(join(ROOT, 'coverage_scan.csv'), csvRows.join('\n'), 'utf8');
  await writeFile(join(ROOT, 'coverage_summary.json'),
    JSON.stringify({ generated: new Date().toISOString(), summary }, null, 2), 'utf8');

  // 5. Print summary table
  console.log('\nCoverage by subject:');
  console.log('Subj | Total | Covered | NotStarted | %  | ECQB-2026 changes covered');
  console.log('-----+-------+---------+------------+-----+--------------------------');
  let tt=0, tc=0;
  for (const s of Object.values(summary)) {
    tt += s.total; tc += s.covered;
    const pct = s.total ? ((s.covered/s.total)*100).toFixed(0) : '0';
    console.log(
      ` ${s.subject} | ${String(s.total).padStart(5)} | ${String(s.covered).padStart(7)} | ${String(s.not_started).padStart(10)} | ${pct.padStart(3)}% | ${s.change_covered}/${s.change_total}`
    );
  }
  const tpct = tt ? ((tc/tt)*100).toFixed(1) : '0';
  console.log('-----+-------+---------+------------+-----+--------------------------');
  console.log(`TOTAL| ${String(tt).padStart(5)} | ${String(tc).padStart(7)} |            | ${tpct}%`);
  console.log('\nWrote: coverage_scan.csv, coverage_summary.json');
  console.log('Next: paste coverage_scan.csv into the All_LOs sheet of atplvector_coverage_tracker.xlsx.');
})();
