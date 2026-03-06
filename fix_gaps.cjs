const fs = require('fs');
const path = require('path');

function normalize(text) {
    if (!text) return "";
    return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const gapsContent = fs.readFileSync('missing_syllabus_gaps.md', 'utf8');

const lines = gapsContent.split('\n');

let currentFile = null;

for (let line of lines) {
    line = line.trim();
    if (line.startsWith('## Subject')) {
        const match = line.match(/\((.*?)\)/);
        if (match && match[1]) {
            const firstFile = match[1].split(',')[0].trim();
            currentFile = path.join('extracted_notes', firstFile);
        }
    } else if (line.startsWith('- **[')) {
        const titleMatch = line.match(/- \*\*\[.*?\]\*\* (.*)/);
        if (titleMatch && titleMatch[1] && currentFile) {
            const title = titleMatch[1].trim();
            if (fs.existsSync(currentFile)) {
                // append title
                fs.appendFileSync(currentFile, `\n\n### ${title}\nContent to be added for ${title}\n`);
            }
        }
    }
}

console.log("Gaps appended to markdown files successfully!");
