const fs = require('fs');
fs.mkdirSync('src/app/(dashboard)/wb-monitoring/last-mile', {recursive:true});
const existing = fs.readFileSync('create-lastmile-page.js', 'utf8');
const code = existing.match(/const code = `([\\s\\S]+?)`;/)[1];
fs.writeFileSync('src/app/(dashboard)/wb-monitoring/last-mile/page.tsx', code, 'utf8');
console.log('done');
