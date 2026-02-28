const fs = require('fs');
const code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
console.log('First 100 chars:', JSON.stringify(code.substring(0,100)));
