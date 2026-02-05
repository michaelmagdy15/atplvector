const fs = require('fs');
const path = require('path');

const SYLLABUS_PATH = 'data/syllabus.json';
const NOTES_DIR = 'extracted_notes';

// Mapping from Syllabus Code Prefix to Markdown filenames
const SUBJECT_MAP = {
    '010': ['air-law.md'],
    '021': ['systems.md', 'electrics.md', 'engines.md', 'jet-turbine-engines.md'],
    '022': ['instruments.md'],
    '031': ['mass-and-balance.md'],
    '032': ['aircraft-performance.md'],
    '033': ['flight-planning.md'],
    '034': ['aircraft-performance.md'],
    '040': ['human-performance.md'],
    '050': ['meteorology.md'],
    '061': ['general-navigation.md'],
    '062': ['radio-navigation.md'],
    '070': ['operational-procedures.md'],
    '071': ['operational-procedures.md'],
    '081': ['principles-of-flight.md'],
    '082': ['principles-of-flight.md'],
    '090': ['communications.md'],
    '100': [] // KSA
};

function loadSyllabus() {
    const main = JSON.parse(fs.readFileSync(SYLLABUS_PATH, 'utf8'));
    let combined = main;
    try {
        const radNav = JSON.parse(fs.readFileSync('data/radio_nav_syllabus.json', 'utf8'));
        if (Array.isArray(radNav)) {
            combined = combined.concat(radNav);
        } else {
            combined.push(radNav);
        }
    } catch (e) {
        console.error("Could not load radio_nav_syllabus.json", e.message);
    }
    return combined;
}

function loadNotes() {
    const notes = {};
    const files = fs.readdirSync(NOTES_DIR);
    for (const file of files) {
        if (file.endsWith('.md')) {
            notes[file] = fs.readFileSync(path.join(NOTES_DIR, file), 'utf8').toLowerCase();
        }
    }
    return notes;
}

function normalize(text) {
    if (!text) return "";
    return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function checkCoverage() {
    const syllabus = loadSyllabus();
    const notes = loadNotes();

    const missing = [];

    function traverse(node) {
        if (!node) return;

        const codeParts = node.code ? node.code.split(' ').filter(x => x !== '00') : [];
        if (codeParts.length === 0) return;

        const subjectCode = codeParts[0];

        if (SUBJECT_MAP[subjectCode]) {
            const relevantFiles = SUBJECT_MAP[subjectCode];
            let combinedNoteContent = "";
            for (const f of relevantFiles) {
                if (notes[f]) combinedNoteContent += notes[f] + " ";
            }

            // Normalize combined content for better matching
            combinedNoteContent = normalize(combinedNoteContent);

            // Check coverage if this node has LOs
            if (node.los && node.los.length > 0) {
                const titleNorm = normalize(node.title);
                let titleFound = combinedNoteContent.includes(titleNorm);

                let loMatches = 0;
                for (const lo of node.los) {
                    const loText = normalize(lo.text);
                    const words = loText.split(' ');
                    // Match first 8 words
                    const chunk = words.slice(0, Math.min(words.length, 8)).join(' ');

                    if (combinedNoteContent.includes(chunk)) {
                        loMatches++;
                    }
                }

                const loCoverage = loMatches / node.los.length;

                if (!titleFound && loCoverage < 0.1) {
                    missing.push({
                        code: node.code,
                        title: node.title,
                        subject: subjectCode,
                        loCount: node.los.length,
                        score: loCoverage
                    });
                }
            }
        }

        if (node.children) {
            node.children.forEach(traverse);
        }
    }

    syllabus.forEach(traverse);

    // Group by Subject
    const grouped = {};
    for (const m of missing) {
        if (!grouped[m.subject]) grouped[m.subject] = [];
        grouped[m.subject].push(m);
    }

    let output = "# Missing Syllabus Topics Report\n\n";
    output += "This report lists syllabus topics where neither the exact Title key-phrase nor significant Learning Objectives content were found in the extracted notes.\n\n";

    // Sort subjects
    const subjects = Object.keys(grouped).sort();

    for (const subj of subjects) {
        output += `## Subject ${subj} (${SUBJECT_MAP[subj]?.join(', ') || 'Unknown'})\n\n`;
        output += `**Total Missing Topics: ${grouped[subj].length}**\n\n`;

        grouped[subj].forEach(m => {
            output += `- **[${m.code}]** ${m.title}\n`;
        });
        output += "\n";
    }

    fs.writeFileSync('missing_syllabus_gaps.md', output, 'utf8');
}

checkCoverage();
