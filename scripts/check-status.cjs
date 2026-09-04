const https = require('https');

const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const RUN_ID = process.argv[2] || '33879804961';

const options = {
  hostname: 'api.github.com',
  path: `/repos/michaelmagdy15/atplvector/actions/runs/${RUN_ID}/jobs`,
  headers: {
    'User-Agent': 'NodeJS',
    'Accept': 'application/vnd.github+json'
  }
};

if (TOKEN) {
  options.headers['Authorization'] = `Bearer ${TOKEN}`;
}

https.get(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.jobs) {
        console.log(`\n=== Run #${RUN_ID} Status ===`);
        json.jobs.forEach(j => {
          console.log(`\nJOB: ${j.name} | Status: ${j.status} | Conclusion: ${j.conclusion}`);
          if (j.steps) {
            j.steps.forEach(s => console.log(`  - [${s.status}] [${s.conclusion}] ${s.name}`));
          }
        });
      } else {
        console.log('Error/message:', data);
      }
    } catch(e) { console.error(e); }
  });
});
