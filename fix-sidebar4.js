const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
console.log('Line 26:', code.split('\\n')[25]);
