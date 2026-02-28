const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
// Fix literal \\n that got inserted
code = code.replace("Activity },\\\\n      { name: 'Остатки ПМ'", "Activity },\\n      { name: 'Остатки ПМ'");
fs.writeFileSync('src/components/Sidebar.tsx', code, 'utf8');
console.log('done:', code.includes("Остатки ПМ"));
