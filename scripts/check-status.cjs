const https = require('https');

const options = {
  hostname: 'api.github.com',
  path: '/repos/michaelmagdy15/atplvector/actions/runs/33878274477/jobs',
  headers: { 'User-Agent': 'NodeJS' }
};

https.get(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.jobs) {
        json.jobs.forEach(j => {
          console.log(`JOB: ${j.name} | Status: ${j.status} | Conclusion: ${j.conclusion}`);
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
