export interface Driver {
  id: number;
  fullName: string;
  vehicleNumber: string;
  carrier: string;
  paymentType: string;
  value: number;
  fines: boolean;
  nds: boolean;
  status: "На линии" | "Не активен" | "В отпуске";
}
export interface Vehicle {
  id: number;
  plateNumber: string;
  driver: string;
  fuelType: string;
  tankVolume: string;
  year: number;
  status: "Активен" | "На ремонте" | "Списан";
}
export interface Delivery {
  id: string;
  driver: string;
  startDate: string;
  endDate: string;
  duration: string;
  boxes: number;
  amount: number;
  status: "В процессе" | "Закрыт" | "С нарушением";
}
export interface WBAccount {
  id: number;
  name: string;
  supplierId: string;
  offices: string;
  status: "Активен" | "Неактивен";
  lastUsed: string;
}
export interface RouteItem {
  id: number;
  routeNumber: string;
  name: string;
  normSK: string;
  paymentType: string;
  payment: number;
  fines: boolean;
  status: "Активен" | "Неактивен";
}
export interface Carrier {
  id: number;
  name: string;
  inn: string;
  paymentType: string;
  value: number;
  nds: boolean;
  fines: boolean;
  status: "Активна" | "Неактивна";
}
