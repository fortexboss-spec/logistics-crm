const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
code = code.replace(
  "{ name: 'WB Мониторинг', href: '/wb-monitoring', icon: Activity },",
  "{ name: 'WB Мониторинг', href: '/wb-monitoring', icon: Activity },\\n      { name: 'Остатки ПМ', href: '/wb-monitoring/last-mile', icon: BarChart3 },"
);
code = code.replace(
  "import { LayoutDashboard, Users, Car, Package, Truck, Phone, Activity, Key, Building2, Route, BarChart3, FileText, ChevronRight } from 'lucide-react';",
  "import { LayoutDashboard, Users, Car, Package, Truck, Phone, Activity, Key, Building2, Route, BarChart3, FileText, ChevronRight } from 'lucide-react';"
);
fs.writeFileSync('src/components/Sidebar.tsx', code, 'utf8');
console.log('done');
