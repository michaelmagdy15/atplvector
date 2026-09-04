const fs = require('fs');
const content = fs.readFileSync('job_error.log', 'utf8');
const lines = content.split('\n');
console.log('Total lines in log:', lines.length);
lines.forEach((l, i) => {
  const low = l.toLowerCase();
  if (low.includes('error') || low.includes('fatal') || low.includes('fastlane finished') || low.includes('build_app') || low.includes('exit status')) {
    console.log((i + 1) + ': ' + l.trim());
  }
});
