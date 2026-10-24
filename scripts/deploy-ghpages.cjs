const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist. Please run npm run build first.');
  process.exit(1);
}

// 1. Ensure .nojekyll exists
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('Created dist/.nojekyll');

// 2. Ensure 404.html exists for SPA fallback routing on GitHub Pages
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');
if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, notFoundPath);
  console.log('Created dist/404.html (SPA fallback)');
}

// 3. Get remote URL
let remoteUrl = '';
try {
  remoteUrl = execSync('git config --get remote.origin.url', { cwd: rootDir, encoding: 'utf-8' }).trim();
} catch (e) {
  remoteUrl = 'https://github.com/michaelmagdy15/atplvector.git';
}
console.log('Target remote:', remoteUrl);

// 4. Initialize temporary git in dist and push
const gitDirInDist = path.join(distDir, '.git');
if (fs.existsSync(gitDirInDist)) {
  fs.rmSync(gitDirInDist, { recursive: true, force: true });
}

try {
  console.log('Initializing deployment commit in dist...');
  execSync('git init -b gh-pages', { cwd: distDir, stdio: 'inherit' });
  execSync('git add -A', { cwd: distDir, stdio: 'inherit' });
  execSync('git commit -m "Deploy production build to GitHub Pages"', { cwd: distDir, stdio: 'inherit' });
  
  console.log('Pushing to gh-pages branch...');
  execSync(`git push -f "${remoteUrl}" gh-pages`, { cwd: distDir, stdio: 'inherit' });
  console.log('Successfully deployed to GitHub Pages!');
} finally {
  if (fs.existsSync(gitDirInDist)) {
    fs.rmSync(gitDirInDist, { recursive: true, force: true });
  }
}
