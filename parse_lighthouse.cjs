const fs = require('fs');
const report = JSON.parse(fs.readFileSync('c:/Users/Mi5a/atplvector/lighthouse-report.json', 'utf8'));

const audits = [
    'viewport',
    'tap-targets',
    'content-width',
    'font-size',
    'first-contentful-paint',
    'interactive'
];

console.log('--- LIGHTHOUSE MOBILE AUDIT SUMMARY ---');
audits.forEach(id => {
    const audit = report.audits[id];
    if (audit) {
        console.log(`[${id.toUpperCase()}] Score: ${audit.score ?? 'N/A'}`);
        if (audit.score < 1) {
            console.log(`   Title: ${audit.title}`);
            console.log(`   Explanation: ${audit.displayValue || 'No display value'}`);
            if (audit.details && audit.details.items) {
                console.log(`   Issues found: ${audit.details.items.length}`);
            }
        }
    } else {
        console.log(`[${id.toUpperCase()}] Not found in report`);
    }
});

const cats = report.categories;
console.log('\n--- OVERALL SCORES ---');
Object.keys(cats).forEach(id => {
    console.log(`${cats[id].title}: ${Math.round(cats[id].score * 100)}`);
});
