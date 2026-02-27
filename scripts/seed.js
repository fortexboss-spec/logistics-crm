const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  console.log("Importing from CRM API...");
  // 1. Import organizations
  const orgsResp = await fetch("http://5.42.101.250/api/organizations/");
  const orgs = await orgsResp.json();
  console.log(`Found ${orgs.length} organizations`);
  const orgMap = {};
  for (const org of orgs) {
    const created = await prisma.organization.upsert({
      where: { id: org.id },
      update: {},
      create: {
        id: org.id,
        name: org.name,
        inn: org.inn || null,
        paymentType: org.payment_type || "fixed",
        paymentValue: org.payment_value || "0.00",
        withVat: org.with_vat || false,
        withPenalties: org.with_penalties || true,
        isActive: org.is_active !== false,
      },
    });
    orgMap[org.id] = created.id;
    console.log(`  Org: ${created.name}`);
  }
  // 2. Import drivers
  const driversResp = await fetch("http://5.42.101.250/api/drivers/");
  const drivers = await driversResp.json();
  console.log(`Found ${drivers.length} drivers`);
  const driverMap = {};
  for (const d of drivers) {
    const created = await prisma.driver.upsert({
      where: { id: d.id },
      update: {},
      create: {
        id: d.id,
        fullName: d.full_name,
        vehicleNumber: d.vehicle_number || null,
        phone: d.phone || null,
        paymentType: d.payment_type || "fixed",
        paymentValue: d.payment_value || "0.00",
        withPenalties: d.with_penalties || false,
        withVat: d.with_vat || false,
        driverIdWb: d.driver_id_wb || null,
        freelancerIdWb: d.freelancer_id_wb || null,
        status: d.status || "на линии",
        organizationId: d.organization_id ? orgMap[d.organization_id] || null : null,
      },
    });
    driverMap[d.id] = created.id;
    console.log(`  Driver: ${created.fullName}`);
  }
  // 3. Import vehicles
  const vehiclesResp = await fetch("http://5.42.101.250/api/vehicles/");
  const vehicles = await vehiclesResp.json();
  console.log(`Found ${vehicles.length} vehicles`);
  for (const v of vehicles) {
    const created = await prisma.vehicle.upsert({
      where: { licensePlate: v.license_plate },
      update: {},
      create: {
        licensePlate: v.license_plate,
        brand: v.brand || "Неизвестно",
        model: v.model || "Неизвестно",
        fuelType: v.fuel_type || "diesel",
        tankCapacity: v.tank_capacity || 60,
        year: v.year || 2020,
        averageConsumption: v.average_consumption || 10,
        initialMileage: v.initial_mileage || 0,
        status: v.status || "active",
        driverId: v.driver_id ? driverMap[v.driver_id] || null : null,
      },
    });
    console.log(`  Vehicle: ${created.licensePlate}`);
  }
  console.log("\\nImport complete!");
  const counts = {
    orgs: await prisma.organization.count(),
    drivers: await prisma.driver.count(),
    vehicles: await prisma.vehicle.count(),
  };
  console.log(`Total: ${counts.orgs} orgs, ${counts.drivers} drivers, ${counts.vehicles} vehicles`);
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());