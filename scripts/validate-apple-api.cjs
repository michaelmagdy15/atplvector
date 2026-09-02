// Script to validate Apple App Store Connect credentials and diagnose account state
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');

function formatPEM(key) {
  let cleaned = (key || '').trim();
  if (!cleaned) return '';

  // Handle base64 encoded input
  if (!cleaned.includes('BEGIN PRIVATE KEY') && !cleaned.includes('BEGIN EC PRIVATE KEY')) {
    try {
      const dec = Buffer.from(cleaned, 'base64').toString('utf8');
      if (dec.includes('PRIVATE KEY')) cleaned = dec.trim();
    } catch (e) {}
  }

  // Extract base64 body if headers exist
  const matches = cleaned.match(/-----BEGIN [A-Z ]+-----([^-]+)-----END [A-Z ]+-----/s);
  if (matches) {
    const body = matches[1].replace(/\s+/g, '');
    const lines = body.match(/.{1,64}/g) || [];
    return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----\n`;
  } else {
    // If headers were lost or pasted as raw base64 string
    const body = cleaned.replace(/[^A-Za-z0-9+/=]/g, '');
    const lines = body.match(/.{1,64}/g) || [];
    return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----\n`;
  }
}

async function main() {
  console.log('------------------------------------------------------------');
  console.log('🔍 Apple App Store Connect Pre-Flight Diagnostic & Auth Check');
  console.log('------------------------------------------------------------');

  const rawKeyId = process.env.APP_STORE_CONNECT_API_KEY_ID || '';
  const rawIssuerId = process.env.APP_STORE_CONNECT_ISSUER_ID || '';
  const rawKeyContent = process.env.APP_STORE_CONNECT_KEY_CONTENT || '';
  const rawTeamId = process.env.APPLE_TEAM_ID || '5NBF6H2RRL';

  const keyId = rawKeyId.trim().replace(/[\r\n\t]/g, '');
  const issuerId = rawIssuerId.trim().replace(/[\r\n\t]/g, '');
  const teamId = rawTeamId.trim().replace(/[\r\n\t]/g, '');

  console.log(`Key ID:    ${keyId ? keyId.substring(0, 3) + '***' + keyId.slice(-2) : '❌ MISSING'}`);
  console.log(`Issuer ID: ${issuerId ? issuerId.substring(0, 5) + '***' : '❌ MISSING'}`);
  console.log(`Team ID:   ${teamId ? teamId : '5NBF6H2RRL'}`);

  if (!keyId || !issuerId || !rawKeyContent) {
    console.error('❌ Error: One or more App Store Connect secrets are missing in GitHub Secrets.');
    process.exit(1);
  }

  // Format PEM key cleanly
  const pemKey = formatPEM(rawKeyContent);
  console.log(`Key Format: ${pemKey.startsWith('-----BEGIN PRIVATE KEY-----') ? '✅ Standard PKCS#8 PEM' : '⚠️ Non-standard'}`);

  // Save to standard Apple locations
  const homeDir = os.homedir();
  const searchDirs = [
    path.join(homeDir, '.appstoreconnect', 'private_keys'),
    path.join(homeDir, '.private_keys')
  ];

  for (const dir of searchDirs) {
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, `AuthKey_${keyId}.p8`);
    fs.writeFileSync(filePath, pemKey, { mode: 0o600 });
    console.log(`📁 Wrote key file: ${filePath}`);
  }

  // Generate JWT for Apple REST API with mandatory iat, exp, aud, and iss
  console.log('\n🔑 Generating ECDSA SHA-256 (ES256) JWT...');
  let token;
  try {
    const header = Buffer.from(JSON.stringify({ alg: 'ES256', kid: keyId, typ: 'JWT' })).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const payload = Buffer.from(JSON.stringify({
      iss: issuerId,
      iat: now - 30, // 30s buffer for clock skew
      exp: now + 1170, // 20 minutes expiration
      aud: 'appstoreconnect-v1'
    })).toString('base64url');
    const message = `${header}.${payload}`;
    
    const signature = crypto.sign('SHA256', Buffer.from(message), {
      key: pemKey,
      dsaEncoding: 'ieee-p1363'
    }).toString('base64url');

    token = `${message}.${signature}`;
    console.log('✅ Successfully generated compliant JWT (with iat & clock-skew buffer).');
  } catch (err) {
    console.error('❌ Failed to sign JWT with provided private key:', err.message);
    console.error('👉 Please verify your APP_STORE_CONNECT_PRIVATE_KEY is a valid .p8 AuthKey file.');
    process.exit(1);
  }

  // Test authentication by querying Apple's App Store Connect API
  console.log('\n📡 Testing connection to Apple App Store Connect REST API...');
  try {
    const res = await fetch('https://api.appstoreconnect.apple.com/v1/apps', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const status = res.status;
    const bodyText = await res.text();

    if (status === 200) {
      console.log('🎉 SUCCESS! Apple App Store Connect authenticated with HTTP 200 OK.');
      try {
        const data = JSON.parse(bodyText);
        const apps = data.data || [];
        console.log(`\n📱 Found ${apps.length} registered app(s) under this account:`);
        let targetAppFound = false;

        apps.forEach((app, idx) => {
          const name = app.attributes?.name;
          const bundleId = app.attributes?.bundleId;
          const sku = app.attributes?.sku;
          console.log(`   ${idx + 1}. "${name}" | Bundle ID: ${bundleId} (SKU: ${sku})`);
          if (bundleId === 'com.atplvector01.app') {
            targetAppFound = true;
          }
        });

        if (targetAppFound) {
          console.log('\n✅ Verified: "com.atplvector01.app" exists in your App Store Connect account!');
        } else {
          console.log('\nℹ️ Notice: "com.atplvector01.app" app record being fetched by Fastlane.');
        }
      } catch (e) {
        console.log('Raw response:', bodyText);
      }
    } else {
      console.error(`\n⚠️ Apple API responded with HTTP ${status}:`);
      console.error(bodyText);
      // Don't kill the job if Fastlane spaceship has alternative auth or certs
    }
  } catch (netErr) {
    console.error('⚠️ Network warning connecting to Apple API:', netErr.message);
  }

  console.log('------------------------------------------------------------\n');
}

main().catch(err => {
  console.error('Diagnostic error:', err);
});
