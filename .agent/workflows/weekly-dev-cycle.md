---
description: Weekly development cycle for ATPL Vector — the full ATPL theory training platform
---

# Weekly Development Cycle — ATPL Vector

Run this workflow every week to systematically advance the platform across all dimensions: content coverage, feature quality, performance, and deployment.

---

## Phase 1 — Recon & Gap Analysis (≈ 30 min)

### 1.1 Regenerate the syllabus coverage report
// turbo
```
node check_coverage.cjs
```
This re-scans `data/syllabus.json` against `extracted_notes/*.md` and writes `missing_syllabus_gaps.md`.

### 1.2 Regenerate the learning-objectives gap report
// turbo
```
python generate_todo_v2.py
```
This cross-references `data/syllabus.json` with `data/learningObjectives.ts` and writes `syllabus_todo_list_v2.txt`.

### 1.3 Review both reports
Open and read:
- `missing_syllabus_gaps.md` — topics where note content is missing
- `syllabus_todo_list_v2.txt` — syllabus nodes not mapped to any View

Pick **one subject** to focus on this week. Prioritise subjects with the most missing topics or the subject you're studying next in your ATPL ground school.

### 1.4 Check for new EASA regulatory updates
Use the aviation MCP tools:
```
mcp_aviation-local-regs_search_easa_regulations("latest amendments")
```
Note any syllabus-relevant changes for incorporation.

---

## Phase 2 — Content Expansion (≈ 2–3 hours)

### 2.1 Enrich extracted notes
For the chosen subject, open the matching file in `extracted_notes/` and fill in the gaps flagged in the reports. Use your ATPL textbooks, EASA docs, and the MCP regulation search tool as sources.

### 2.2 Build or refine interactive components
For the chosen subject, pick 1–3 uncovered syllabus topics and either:
- **Create** a new interactive component (visualiser, simulator, calculator, quiz)
- **Enhance** an existing component (add edge cases, improve animations, fix bugs)

Naming convention: `components/<SubjectFolder>/<PascalCaseName>.tsx`

### 2.3 Wire new components into the router
1. Add a new `View` enum value in `types.ts`
2. Register the lazy import in `components/Router.tsx`
3. Add the route entry in `config/routes.ts` and `config/subjectRoutes.ts`
4. Add a sidebar entry in `data/sidebarNavigation.ts`
5. Map syllabus IDs to the new View in `data/learningObjectives.ts`

### 2.4 Update the question bank (if applicable)
If the subject has questions in `public/question-bank/atpl/*.json`, review and add new questions for the topics you just covered.

---

## Phase 3 — Quality & Polish (≈ 1 hour)

### 3.1 Run the dev server and visually test
// turbo
```
npm run dev
```
Navigate through the new and modified components. Check:
- [ ] Desktop layout (≥1024px)
- [ ] Tablet layout (768px)
- [ ] Mobile layout (375px)
- [ ] Dark theme consistency
- [ ] All interactive elements functional (buttons, sliders, inputs)
- [ ] No console errors

### 3.2 Fix any IDE lint warnings
Check for problems reported by VSCode/TypeScript:
```
npx tsc --noEmit
```
Fix type errors, unused imports, and missing exports.

### 3.3 Check bundle size
// turbo
```
npm run build
```
Review the Vite output for any chunks larger than 500KB. If found, add lazy imports:
```tsx
const HeavyComponent = React.lazy(() => import('./components/HeavyComponent'));
```

### 3.4 Review the design system
Open `design-system/atpl-vector/MASTER.md` and check that new components follow the established tokens (colours, spacing, typography, glass-card patterns). Update the design doc if you've introduced new patterns.

---

## Phase 4 — Data Integrity (≈ 20 min)

### 4.1 Verify Supabase schema
Check that `full_schema_export.sql` is up to date. If you've added new tables or columns:
```sql
-- Run in Supabase SQL Editor and export
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

### 4.2 Test auth flows
Verify these still work:
- [ ] New user signup → profile auto-creation → PENDING_APPROVAL state
- [ ] Invite code redemption → trial activation
- [ ] Demo login → 3-hour preview → DEMO_EXPIRED state
- [ ] Admin dashboard access (for admin users)

### 4.3 Run the coverage scripts one more time
// turbo
```
node check_coverage.cjs && python generate_todo_v2.py
```
Confirm the gap counts decreased from Phase 1.

---

## Phase 5 — Commit & Deploy (≈ 15 min)

### 5.1 Stage and commit
```
git add -A
git commit -m "feat(<subject-code>): <brief description of what was added/improved>"
```
Follow conventional commit format:
- `feat(062):` new Radio Nav component
- `fix(050):` corrected Met thermodynamics formula  
- `content(040):` expanded HPL extracted notes
- `ui:` design system or layout improvements

### 5.2 Push to remote
```
git push origin main
```

### 5.3 Deploy to Cloud Run
The `cloudbuild.yaml` triggers automatically on push, but you can also deploy manually:
```
npm run build
```
Then use the Cloud Run MCP tools or `gcloud` CLI:
```
gcloud builds submit --config cloudbuild.yaml
```

### 5.4 Verify production
Open the deployed URL and spot-check:
- [ ] Login works
- [ ] Navigation loads
- [ ] New components render correctly
- [ ] No broken routes

---

## Phase 6 — Plan Next Week (≈ 10 min)

### 6.1 Update the progress snapshot
Create or update a short note in the artifacts directory summarising:
- Subjects worked on this week
- Components added/improved
- Gap count before vs after (from the reports)
- Priority subject for next week

### 6.2 Identify the next focus area
Look at the gap reports and pick the next subject. Rotate through subjects to ensure broad coverage:

| Priority | Subject | Code | Est. Missing Topics |
|----------|---------|------|---------------------|
| 1 | Principles of Flight | 081 | ~113 |
| 2 | Meteorology | 050 | ~99 |
| 3 | Air Law | 010 | ~90 |
| 4 | Instruments | 022 | ~83 |
| 5 | Operational Procedures | 071 | ~59 |
| 6 | Radio Navigation | 062 | ~55 |
| 7 | Aircraft Performance | 032 | ~38 |
| 8 | General Navigation | 061 | ~32 |
| 9 | Human Performance | 040 | ~29 |
| 10 | Flight Planning | 033 | ~26 |

### 6.3 Note any tech debt
Record anything that needs fixing but wasn't urgent enough to address this week (e.g., accessibility issues, performance bottlenecks, missing error boundaries).

---

## Quick Reference — Slash Commands

| Command | What it does |
|---------|--------------|
| `/weekly-dev-cycle` | Run this full workflow |
| `node check_coverage.cjs` | Regenerate syllabus gap report |
| `python generate_todo_v2.py` | Regenerate LO gap report |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npx tsc --noEmit` | Type-check without emitting |

---

## Weekly Cadence Summary

```
Monday/Tuesday:   Phase 1 (Recon) + Phase 2 (Content)
Wednesday:        Phase 2 (Content continued) + Phase 3 (Quality)
Thursday:         Phase 3 (Quality) + Phase 4 (Data Integrity)
Friday:           Phase 5 (Deploy) + Phase 6 (Plan)
```

Total estimated time: **4–5 hours per week**
