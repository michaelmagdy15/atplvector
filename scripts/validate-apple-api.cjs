// Script to validate Apple App Store Connect credentials and diagnose account state
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function main() {
  console.log('------------------------------------------------------------');
  console.log('🔍 Apple App Store Connect Pre-Flight Diagnostic & Auth Check');
  console.log('------------------------------------------------------------');

  const rawKeyId = process.env.APP_STORE_CONNECT_API_KEY_ID || '';
  const rawIssuerId = process.env.APP_STORE_CONNECT_ISSUER_ID || '';
  const rawKeyContent = process.env.APP_STORE_CONNECT_KEY_CONTENT || '';
  const rawTeamId = process.env.APPLE_TEAM_ID || '';

  const keyId = rawKeyId.trim().replace(/[\r\n\t]/g, '');
  const issuerId = rawIssuerId.trim().replace(/[\r\n\t]/g, '');
  const teamId = rawTeamId.trim().replace(/[\r\n\t]/g, '');

  console.log(`Key ID:    ${keyId ? keyId.substring(0, 3) + '***' + keyId.slice(-2) : '❌ MISSING'}`);
  console.log(`Issuer ID: ${issuerId ? issuerId.substring(0, 5) + '***' : '❌ MISSING'}`);
  console.log(`Team ID:   ${teamId ? teamId.substring(0, 3) + '***' : '❌ MISSING'}`);

  if (!keyId || !issuerId || !rawKeyContent) {
    console.error('❌ Error: One or more App Store Connect secrets are missing in GitHub Secrets.');
    process.exit(1);
  }

  // Parse private key content
  let pemKey = rawKeyContent.trim();
  if (!pemKey.includes('BEGIN PRIVATE KEY') && !pemKey.includes('BEGIN RSA PRIVATE KEY')) {
    try {
      const decoded = Buffer.from(pemKey, 'base64').toString('utf8');
      if (decoded.includes('PRIVATE KEY')) {
        pemKey = decoded.trim();
      }
    } catch (e) {
      console.warn('⚠️ Warning: Key was not standard base64.');
    }
  }

  // Ensure newlines
  pemKey = pemKey.replace(/\\n/g, '\n').trim() + '\n';

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

  // Generate JWT for Apple REST API
  console.log('\n🔑 Generating ECDSA SHA-256 (ES256) JWT...');
  let token;
  try {
    const header = Buffer.from(JSON.stringify({ alg: 'ES256', kid: keyId, typ: 'JWT' })).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const payload = Buffer.from(JSON.stringify({ iss: issuerId, exp: now + 1200, aud: 'appstoreconnect-v1' })).toString('base64url');
    const message = `${header}.${payload}`;
    
    const signature = crypto.sign('SHA256', Buffer.from(message), {
      key: pemKey,
      dsaEncoding: 'ieee-p1363'
    }).toString('base64url');

    token = `${message}.${signature}`;
    console.log('✅ Successfully generated JWT.');
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
          console.log('\n⚠️ Notice: "com.atplvector01.app" is not yet in the apps list.');
          console.log('   Fastlane / Xcode will register it or use the bundle ID listed above.');
        }
      } catch (e) {
        console.log('Raw response:', bodyText);
      }
    } else {
      console.error(`\n❌ Apple API responded with HTTP ${status}:`);
      console.error(bodyText);

      if (status === 401) {
        console.error('\n🚨 401 UNAUTHORIZED DIAGNOSIS:');
        console.error('1. Check that the Key ID matches the filename AuthKey_<KeyID>.p8.');
        console.error('2. Check that the Issuer ID is your Account Issuer ID (found at top of Keys page).');
        console.error('3. Check that the API Key in App Store Connect has role "Admin" or "App Manager".');
      } else if (status === 403) {
        console.error('\n🚨 403 FORBIDDEN DIAGNOSIS:');
        console.error('The API key does not have permission for this resource, or terms of service must be accepted.');
      }
      process.exit(1);
    }
  } catch (netErr) {
    console.error('❌ Network error connecting to Apple API:', netErr.message);
    process.exit(1);
  }

  console.log('------------------------------------------------------------\n');
}

main().catch(err => {
  console.error('Fatal error in diagnostic:', err);
  process.exit(1);
});
