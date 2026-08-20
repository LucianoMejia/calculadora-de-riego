const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const appJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'app.json'), 'utf-8'));
const version = appJson.expo.version || '1.0.0';

let commit = 'dev';
try {
  commit = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
} catch {}

const content = `export const GIT_COMMIT = '${commit}';\nexport const APP_VERSION = '${version}';\n`;

fs.writeFileSync(path.join(__dirname, '..', 'lib', 'gitInfo.ts'), content);
console.log(`gitInfo.ts → v${version} · ${commit}`);
