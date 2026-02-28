const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
// Fix the broken line - remove the \\n that was inserted
code = code.replace(
  "{ name: 'WB Мониторинг', href: '/wb-monitoring', icon: Activity },\\n      { name: 'Остатки ПМ', href: '/wb-monitoring/last-mile', icon: BarChart3 },",
  "{ name: 'WB Мониторинг', href: '/wb-monitoring', icon: Activity },\\n      { name: 'Остатки ПМ', href: '/wb-monitoring/last-mile', icon: BarChart3 },"
);
// Actually just rewrite the WB section cleanly
code = code.replace(
  /\\{ name: 'WB Мониторинг'.*?\\},\\s*\\{ name: 'WB Аккаунты'/s,
  "{ name: 'WB Мониторинг', href: '/wb-monitoring', icon: Activity },\\n      { name: 'Остатки ПМ', href: '/wb-monitoring/last-mile', icon: BarChart3 },\\n      { name: 'WB Аккаунты'"
);
fs.writeFileSync('src/components/Sidebar.tsx', code, 'utf8');
console.log('done');
