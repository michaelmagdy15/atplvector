const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const JOB_ID = process.argv[2] || '101041418707';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: {
        'User-Agent': 'NodeJS',
        'Authorization': `Bearer ${TOKEN}`,
        'Accept': 'application/vnd.github+json'
      }
    };

    https.get(options, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // follow redirect
        https.get(res.headers.location, redirectRes => {
          let data = '';
          redirectRes.on('data', chunk => data += chunk);
          redirectRes.on('end', () => resolve(data));
        }).on('error', reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  try {
    console.log('Fetching logs for job', JOB_ID);
    const logs = await fetchUrl(`https://api.github.com/repos/michaelmagdy15/atplvector/actions/jobs/${JOB_ID}/logs`);
    fs.writeFileSync(path.join(__dirname, '..', 'job_error.log'), logs, 'utf8');
    console.log('Saved', logs.length, 'bytes to job_error.log');
  } catch (err) {
    console.error('Error fetching logs:', err);
  }
}

run();
