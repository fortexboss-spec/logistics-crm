const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
// Add Остатки ПМ after WB Мониторинг
const search = "{ name: 'WB \\u041c\\u043e\\u043d\\u0438\\u0442\\u043e\\u0440\\u0438\\u043d\\u0433', href: '/wb-monitoring', icon: Activity },";
const replace = "{ name: 'WB \\u041c\\u043e\\u043d\\u0438\\u0442\\u043e\\u0440\\u0438\\u043d\\u0433', href: '/wb-monitoring', icon: Activity },\\n      { name: '\\u041e\\u0441\\u0442\\u0430\\u0442\\u043a\\u0438 \\u041f\\u041c', href: '/wb-monitoring/last-mile', icon: BarChart3 },";
code = code.replace(search, replace);
fs.writeFileSync('src/components/Sidebar.tsx', code, 'utf8');
console.log('done, hasLM:', code.includes('last-mile'));
