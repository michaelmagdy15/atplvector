// scripts/cleanup-dev-certs.cjs
// Automatically cleans up stale/ephemeral Development certificates created by CI
// so Xcode's automatic signing always has free slots (Apple limits dev certs to 2).
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const KEY_ID = process.env.APP_STORE_CONNECT_API_KEY_ID || '7SP72YX2TU';
const ISSUER_ID = process.env.APP_STORE_CONNECT_ISSUER_ID || '7b5e3219-0582-4aee-a93f-2b37d5bc8ecb';

function getPrivateKey() {
  if (process.env.APP_STORE_CONNECT_PRIVATE_KEY) {
    return process.env.APP_STORE_CONNECT_PRIVATE_KEY;
  }
  const defaultPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.appstoreconnect', 'private_keys', `AuthKey_${KEY_ID}.p8`);
  if (fs.existsSync(defaultPath)) {
    return fs.readFileSync(defaultPath, 'utf8');
  }
  const localDesktop = 'C:\\Users\\Mi5a\\Desktop\\gggg\\AuthKey_7SP72YX2TU.p8';
  if (fs.existsSync(localDesktop)) {
    return fs.readFileSync(localDesktop, 'utf8');
  }
  return '';
}

function formatPEM(key) {
  let cleaned = (key || '').trim();
  if (!cleaned) return '';
  if (!cleaned.includes('BEGIN PRIVATE KEY') && !cleaned.includes('BEGIN EC PRIVATE KEY')) {
    try {
      const dec = Buffer.from(cleaned, 'base64').toString('utf8');
      if (dec.includes('PRIVATE KEY')) cleaned = dec.trim();
    } catch (e) {}
  }
  const matches = cleaned.match(/-----BEGIN [A-Z ]+-----([^-]+)-----END [A-Z ]+-----/s);
  if (matches) {
    const body = matches[1].replace(/\s+/g, '');
    const lines = body.match(/.{1,64}/g) || [];
    return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----\n`;
  }
  const body = cleaned.replace(/[^A-Za-z0-9+/=]/g, '');
  const lines = body.match(/.{1,64}/g) || [];
  return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----\n`;
}

function makeToken(pemKey) {
  const header = Buffer.from(JSON.stringify({ alg: 'ES256', kid: KEY_ID, typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    iss: ISSUER_ID,
    iat: now - 30,
    exp: now + 600,
    aud: 'appstoreconnect-v1'
  })).toString('base64url');

  const message = header + '.' + payload;
  const signature = crypto.sign('SHA256', Buffer.from(message), {
    key: pemKey,
    dsaEncoding: 'ieee-p1363'
  }).toString('base64url');

  return message + '.' + signature;
}

async function cleanup() {
  console.log('🧹 Checking for stale Development certificates on Apple Developer portal...');
  const rawKey = getPrivateKey();
  if (!rawKey) {
    console.log('⚠️ No private key found, skipping certificate cleanup.');
    return;
  }
  const pem = formatPEM(rawKey);
  const token = makeToken(pem);

  try {
    const res = await fetch('https://api.appstoreconnect.apple.com/v1/certificates?filter[certificateType]=DEVELOPMENT', {
      headers: { Authorization: 'Bearer ' + token }
    });
    if (!res.ok) {
      console.log(`⚠️ Apple API responded with ${res.status} ${res.statusText}`);
      return;
    }
    const json = await res.json();
    const certs = json.data || [];
    console.log(`Found ${certs.length} Development certificate(s).`);

    for (const cert of certs) {
      console.log(`Revoking stale dev cert: ${cert.id} (${cert.attributes?.name || 'Unnamed'})`);
      const delRes = await fetch(`https://api.appstoreconnect.apple.com/v1/certificates/${cert.id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      });
      console.log(` -> Result: ${delRes.status}`);
    }
    console.log('✅ Development certificate slots are clean and ready for Xcode.');
  } catch (err) {
    console.error('Error during cleanup:', err.message);
  }
}

cleanup();
