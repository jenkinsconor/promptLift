// Run: node icons/generate-icons.js
// Requires: npm install sharp (auto-installs below)

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 1. Auto-install sharp if missing
try {
  require.resolve('sharp');
} catch {
  console.log('Installing sharp...');
  execSync('npm install sharp', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
}

const sharp = require('sharp');

const svgPath = path.join(__dirname, 'icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

// 2. Render each size
async function run() {
  for (const size of [16, 48, 128]) {
    const outPath = path.join(__dirname, `icon${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`✓ icon${size}.png`);
  }
  console.log('\nDone! Reload the extension at chrome://extensions');
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
