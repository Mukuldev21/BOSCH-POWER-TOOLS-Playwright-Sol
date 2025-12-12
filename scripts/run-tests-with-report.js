const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=================================================');
console.log('   🚀  BOSCH Power Tools - Test & Report Runner   ');
console.log('=================================================');

// 1. Clean results
console.log('\n🧹 Cleaning old allure-results...');
const resultsDir = path.join(__dirname, '..', 'allure-results');
const reportDir = path.join(__dirname, '..', 'allure-report');
if (fs.existsSync(resultsDir)) {
    fs.rmSync(resultsDir, { recursive: true, force: true });
}
if (fs.existsSync(reportDir)) {
    fs.rmSync(reportDir, { recursive: true, force: true });
}
console.log('   ✅ Cleaned.');

// 2. Run tests
const cliArgs = process.argv.slice(2);
// Smart argument handling:
// If a user passes strings that don't look like flags (-) or file paths (contain / or \ or end in .ts/.js),
// assume they are test title grep patterns and prepend -g.
// This allows `npm run test "MANUAL-001"` to work as expected.
const formattedArgs = cliArgs.map(arg => {
    const isFlag = arg.startsWith('-');
    const isFilePath = arg.includes('/') || arg.includes('\\') || arg.endsWith('.ts') || arg.endsWith('.js');
    if (!isFlag && !isFilePath && arg.trim().length > 0) {
        console.log(`ℹ️  Treating argument "${arg}" as a grep pattern (-g).`);
        return `-g "${arg}"`;
    }
    return arg;
});

const args = formattedArgs.join(' ');
console.log(`\n🧪 Running Playwright tests${args ? ` with args: ${args}` : ''}...`);

let testExitCode = 0;
try {
    // Inherit stdio to see live test output
    execSync(`npx playwright test ${args}`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('   ✅ Tests passed.');
} catch (error) {
    testExitCode = error.status || 1;
    console.log('   ❌ Tests failed. Proceeding to generate report...');
}

// 3. Generate report
console.log('\n📊 Generating Allure report...');
try {
    execSync('npm run report:generate', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('   ✅ Report generated.');
} catch (error) {
    console.error('   ❌ Failed to generate report:', error.message);
    process.exit(1);
}

// 4. Open report
console.log('\n🌐 Opening Allure report...');
console.log('   (Press Ctrl+C to stop the server)');
try {
    execSync('npm run report:open', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
} catch (error) {
    // Ignore error if user kills the server with Ctrl+C
    console.log('\n👋 Report server stopped.');
}

// Exit with the test's exit code so CI/CD knows if tests passed/failed
process.exit(testExitCode);
