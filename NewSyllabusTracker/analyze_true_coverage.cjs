const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const ATPL_VECTOR_ROOT = path.resolve(__dirname, '..');
const XLSX_PATH = path.join(__dirname, 'tk-syllabus-comparison-doc-v6.xlsx');
const LO_TS_PATH = path.join(ATPL_VECTOR_ROOT, 'data', 'learningObjectives.ts');
const ROUTES_TS_PATH = path.join(ATPL_VECTOR_ROOT, 'config', 'routes.ts');
const SUMMARY_JSON_PATH = path.join(__dirname, 'true_coverage_summary.json');
const TASKLIST_MD_PATH = path.join(__dirname, 'agent_tasklist.md');

// 1. Parse xlsx for ATPL(A) LOs
console.log('Parsing XLSX for ATPL(A) required LOs...');
const workbook = xlsx.readFile(XLSX_PATH);
const requiredLOs = [];
// We only care about subject sheets (e.g. 010, 021, etc.)
const subjectSheets = workbook.SheetNames.filter(name => /^\d{3}-/.test(name));

for (const sheetName of subjectSheets) {
    const sheet = workbook.Sheets[sheetName];
    // header: 1 gives array of arrays
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    // Assuming row structure:
    // index 3: 2020 syllabus reference
    // index 4: 2020 syllabus text
    // index 12: ATPL(A) requirement column (contains 'X' if required)
    
    // Start from row 2 (index 1) which is usually the first data row or after headers
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row) continue;
        const syllabusRef = row[3];
        const syllabusText = row[4];
        const atplReq = row[12];
        
        if (atplReq === 'X' && typeof syllabusRef === 'string') {
            const parts = syllabusRef.split('.');
            // We want leaf level LOs, typically 4 or 5 parts (e.g. 010.01.01.01 or 010.01.01.01.01)
            // But we will capture all 'X' marked rows as required targets
            if (parts.length >= 2) {
                requiredLOs.push({
                    id: syllabusRef,
                    subject: parts[0],
                    text: syllabusText || ''
                });
            }
        }
    }
}
console.log(`Found ${requiredLOs.length} required ATPL(A) LOs.`);

// 2. Parse data/learningObjectives.ts for mapping
console.log('Parsing learningObjectives.ts...');
const loTsContent = fs.readFileSync(LO_TS_PATH, 'utf-8');
// Regex to extract: id: '010.01.01', ..., coveredBy: View.XXX
const loMappingPattern = /\{[^}]*id:\s*['"]([\d\.]+)['"][^}]*coveredBy:\s*View\.([A-Z0-9_]+)[^}]*\}/g;
const loToViewMap = {};
let match;
while ((match = loMappingPattern.exec(loTsContent)) !== null) {
    loToViewMap[match[1]] = match[2];
}

// 3. Parse config/routes.ts for Component mapping
console.log('Parsing routes.ts...');
const routesTsContent = fs.readFileSync(ROUTES_TS_PATH, 'utf-8');
const viewToComponentMap = {};
// Example: [View.AIR_LAW_CONVENTIONS]: React.lazy(() => import('../components/AirLawConventions'))
const routePattern = /\[View\.([A-Z0-9_]+)\]:\s*React\.lazy\(\(\)\s*=>\s*import\(['"](\.\.\/components\/[^'"]+)['"]\)/g;
while ((match = routePattern.exec(routesTsContent)) !== null) {
    let compPath = match[2];
    // convert relative path '../components/...' to absolute
    // compPath usually like '../components/InternationalLaw'
    // so we strip '../' and join with ATPL_VECTOR_ROOT
    compPath = compPath.replace(/^\.\.\//, '');
    compPath = path.join(ATPL_VECTOR_ROOT, compPath);
    viewToComponentMap[match[1]] = compPath;
}

// 4. Analyze each LO
console.log('Analyzing true implementation status...');
const results = {
    IMPLEMENTED: [],
    STUB: [],
    PREFIX_COVERED: [],
    NOT_MAPPED: []
};

for (const lo of requiredLOs) {
    // Find the longest matching prefix in loToViewMap
    let viewName = null;
    let currentId = lo.id;
    let matchType = 'NONE';
    
    while (currentId) {
        if (loToViewMap[currentId]) {
            viewName = loToViewMap[currentId];
            matchType = (currentId === lo.id) ? 'EXACT' : 'PREFIX';
            break;
        }
        const lastDot = currentId.lastIndexOf('.');
        if (lastDot === -1) break;
        currentId = currentId.substring(0, lastDot);
    }

    let status = 'NOT_MAPPED';
    let details = 'No mapping in learningObjectives.ts';
    
    if (viewName) {
        let compBase = viewToComponentMap[viewName];
        if (!compBase) {
            status = 'NOT_MAPPED';
            details = `Mapped to View.${viewName} but no route found`;
        } else {
            let compPath = '';
            if (fs.existsSync(compBase + '.tsx')) compPath = compBase + '.tsx';
            else if (fs.existsSync(compBase + '/index.tsx')) compPath = compBase + '/index.tsx';
            else if (fs.existsSync(compBase + '.ts')) compPath = compBase + '.ts';
            else if (fs.existsSync(compBase + '.jsx')) compPath = compBase + '.jsx';
            else if (fs.existsSync(compBase + '.js')) compPath = compBase + '.js';
            
            if (!compPath) {
                status = 'STUB';
                details = `File not found at ${compBase}`;
            } else {
                const compContent = fs.readFileSync(compPath, 'utf-8');
                const stats = fs.statSync(compPath);
                
                let isStub = false;
                if (compContent.includes('<Placeholder') || compContent.includes('import Placeholder') || compContent.includes('under development') || (stats.size < 800 && !compContent.includes('useState') && !compContent.includes('useEffect'))) {
                    isStub = true;
                }
                
                if (isStub) {
                    status = 'STUB';
                    details = `Component is stubbed: ${path.basename(compPath)}`;
                } else {
                    if (matchType === 'EXACT') {
                        status = 'IMPLEMENTED';
                        details = `Component is implemented: ${path.basename(compPath)}`;
                    } else {
                        status = 'PREFIX_COVERED';
                        details = `Covered by parent view (${viewName}) but lacks exact LO specific implementation.`;
                    }
                }
            }
        }
    }
    
    lo.status = status;
    lo.details = details;
    results[status].push(lo);
}

console.log(`\nResults:`);
console.log(`Implemented: ${results.IMPLEMENTED.length}`);
console.log(`Prefix Covered: ${results.PREFIX_COVERED.length}`);
console.log(`Stubbed: ${results.STUB.length}`);
console.log(`Not Mapped: ${results.NOT_MAPPED.length}`);

// 5. Generate outputs
console.log('\nWriting outputs...');
fs.writeFileSync(SUMMARY_JSON_PATH, JSON.stringify(results, null, 2));

let mdContent = `# ATPL Vector Agent Tasklist\n\n`;
mdContent += `This list contains all ATPL(A) required Learning Objectives that are currently either completely missing, only exist as empty/stubbed components, or are only mapped generically to a parent component without an exact feature.\n\n`;

const subjectNames = {
    '010': 'Air Law',
    '021': 'Aircraft General Knowledge',
    '022': 'Instruments',
    '031': 'Mass & Balance',
    '032': 'Performance (A)',
    '033': 'Flight Planning',
    '040': 'Human Performance',
    '050': 'Meteorology',
    '061': 'General Navigation',
    '062': 'Radio Navigation',
    '070': 'Operational Procedures',
    '081': 'Principles of Flight',
    '090': 'Communications'
};

const groupedStubsAndMissing = [...results.STUB, ...results.NOT_MAPPED, ...results.PREFIX_COVERED].reduce((acc, lo) => {
    if (!acc[lo.subject]) acc[lo.subject] = [];
    acc[lo.subject].push(lo);
    return acc;
}, {});

// Sort subjects
Object.keys(groupedStubsAndMissing).sort().forEach(subjectCode => {
    mdContent += `## ${subjectCode} - ${subjectNames[subjectCode] || 'Unknown Subject'}\n\n`;
    
    // Sort LOs within subject
    groupedStubsAndMissing[subjectCode].sort((a, b) => a.id.localeCompare(b.id));
    
    for (const lo of groupedStubsAndMissing[subjectCode]) {
        mdContent += `### [ ] ${lo.id}\n`;
        mdContent += `**Description:** ${lo.text}\n`;
        mdContent += `**Status:** ${lo.status} (${lo.details})\n\n`;
    }
});

fs.writeFileSync(TASKLIST_MD_PATH, mdContent);
console.log('Done! Generated true_coverage_summary.json and agent_tasklist.md');
