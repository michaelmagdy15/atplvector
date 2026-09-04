// scripts/test-apple-auth.cjs
// Quick script to verify Apple App Store Connect API credentials.
// Can run locally or inside GitHub Actions.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function formatPEM(key) {
  let cleaned = (key || '').trim();
  if (!cleaned) return '';

  // Handle base64 encoded input if necessary
  if (!cleaned.includes('BEGIN PRIVATE KEY') && !cleaned.includes('BEGIN EC PRIVATE KEY')) {
    try {
      const dec = Buffer.from(cleaned, 'base64').toString('utf8');
      if (dec.includes('PRIVATE KEY')) cleaned = dec.trim();
    } catch (e) {}
  }

  // Extract base64 body if standard PEM headers exist
  const matches = cleaned.match(/-----BEGIN [A-Z ]+-----([^-]+)-----END [A-Z ]+-----/s);
  if (matches) {
    const body = matches[1].replace(/\s+/g, '');
    const lines = body.match(/.{1,64}/g) || [];
    return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----\n`;
  } else {
    // If raw base64 string
    const body = cleaned.replace(/[^A-Za-z0-9+/=]/g, '');
    const lines = body.match(/.{1,64}/g) || [];
    return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----\n`;
  }
}

async function testAuth(keyId, issuerId, privateKey) {
  console.log('====================================================');
  console.log('🍏 Apple App Store Connect API Authentication Test');
  console.log('====================================================');

  if (!keyId || !issuerId || !privateKey) {
    console.error('❌ Missing required credentials!');
    console.error('   Key ID:', keyId ? 'Set (' + keyId + ')' : 'MISSING');
    console.error('   Issuer ID:', issuerId ? 'Set (' + issuerId + ')' : 'MISSING');
    console.error('   Private Key:', privateKey ? 'Set' : 'MISSING');
    process.exit(1);
  }

  console.log(`🔑 Key ID:    ${keyId}`);
  console.log(`🏢 Issuer ID: ${issuerId}`);

  const pemKey = formatPEM(privateKey);
  console.log(`📄 Key Format: ${pemKey.startsWith('-----BEGIN PRIVATE KEY-----') ? '✅ Valid PKCS#8 PEM' : '⚠️ Non-standard format'}`);

  // Generate ES256 JWT
  let token;
  try {
    const header = Buffer.from(JSON.stringify({ alg: 'ES256', kid: keyId.trim(), typ: 'JWT' })).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const payload = Buffer.from(JSON.stringify({
      iss: issuerId.trim(),
      iat: now - 30, // 30s buffer for clock skew
      exp: now + 600, // 10 minutes expiry
      aud: 'appstoreconnect-v1'
    })).toString('base64url');
    
    const message = `${header}.${payload}`;
    const signature = crypto.sign('SHA256', Buffer.from(message), {
      key: pemKey,
      dsaEncoding: 'ieee-p1363'
    }).toString('base64url');

    token = `${message}.${signature}`;
    console.log('✅ Generated signed JWT successfully.');
  } catch (err) {
    console.error('❌ Failed to sign JWT:', err.message);
    console.error('👉 Make sure the private key is a valid .p8 file content.');
    process.exit(1);
  }

  // Request App Store Connect API
  console.log('\n📡 Sending request to https://api.appstoreconnect.apple.com/v1/apps ...');
  try {
    const res = await fetch('https://api.appstoreconnect.apple.com/v1/apps?limit=5', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const status = res.status;
    const bodyText = await res.text();

    if (status === 200) {
      console.log('\n🎉 SUCCESS! Apple authenticated with HTTP 200 OK.');
      try {
        const data = JSON.parse(bodyText);
        const apps = data.data || [];
        console.log(`📱 Found ${apps.length} registered application(s):`);
        apps.forEach((app, idx) => {
          console.log(`   ${idx + 1}. Name: "${app.attributes?.name}" | Bundle ID: ${app.attributes?.bundleId}`);
        });
      } catch (e) {
        console.log(bodyText);
      }
      console.log('\n✅ Credentials are 100% verified and ready for CI/CD deployment!');
      return true;
    } else {
      console.error(`\n❌ Apple rejected request with HTTP ${status}:`);
      console.error(bodyText);
      console.error('\n🔍 Diagnosis:');
      if (status === 401) {
        console.error('   1. Did you accept the latest Apple Developer Agreement on developer.apple.com?');
        console.error('   2. Is the Key ID correct for this private key (.p8 file)?');
        console.error('   3. Is the Issuer ID matching the one shown in App Store Connect Keys tab?');
        console.error('   4. Does the key have "Admin" or "App Manager" access role?');
      }
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Network error connecting to Apple API:', err.message);
    process.exit(1);
  }
}

// Support reading from env vars or CLI arguments
const keyId = process.env.APP_STORE_CONNECT_API_KEY_ID || process.argv[2];
const issuerId = process.env.APP_STORE_CONNECT_ISSUER_ID || process.argv[3];
let keyContent = process.env.APP_STORE_CONNECT_KEY_CONTENT || process.argv[4];

// If keyContent is a file path, read it
if (keyContent && fs.existsSync(keyContent)) {
  keyContent = fs.readFileSync(keyContent, 'utf8');
}

testAuth(keyId, issuerId, keyContent);
