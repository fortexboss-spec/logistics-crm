const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
const idx = code.indexOf('Activity');
console.log('Context:', JSON.stringify(code.substring(idx-10, idx+200)));
