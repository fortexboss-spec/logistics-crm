const fs = require('fs');
let code = fs.readFileSync('src/app/(dashboard)/routes/page.tsx', 'utf8');
code = code.replace("operation_type === 'OPERATION_TYPE_CREDIT'", "operation_type === 'OPERATION_TYPE_WAYSHEET'");
fs.writeFileSync('src/app/(dashboard)/routes/page.tsx', code, 'utf8');
console.log('done');
