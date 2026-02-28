const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
// Show what's around Activity
const idx = code.indexOf('Activity');
console.log('Context:', JSON.stringify(code.substring(idx-10, idx+150)));
