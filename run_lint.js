const { execSync } = require('child_process');
const fs = require('fs');
try {
    const out = execSync('npx eslint "src/**/*.{ts,tsx}"', { encoding: 'utf-8' });
    fs.writeFileSync('lint_report.txt', out);
} catch (e) {
    fs.writeFileSync('lint_report.txt', e.stdout);
}
