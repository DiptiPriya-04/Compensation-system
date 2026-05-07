const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Create companies
  const google = await prisma.company.upsert({
    where: { slug: 'google' },
    update: {},
    create: { name: 'Google', slug: 'google' }
  });

  const amazon = await prisma.company.upsert({
    where: { slug: 'amazon' },
    update: {},
    create: { name: 'Amazon', slug: 'amazon' }
  });

  const meta = await prisma.company.upsert({
    where: { slug: 'meta' },
    update: {},
    create: { name: 'Meta', slug: 'meta' }
  });

  // Create level mappings
  const mappings = [
    { companyUuid: google.companyUuid, companyLevel: 'L3', standardRank: 2 },
    { companyUuid: google.companyUuid, companyLevel: 'L4', standardRank: 4 },
    { companyUuid: google.companyUuid, companyLevel: 'L5', standardRank: 6 },
    { companyUuid: amazon.companyUuid, companyLevel: 'SDE I', standardRank: 2 },
    { companyUuid: amazon.companyUuid, companyLevel: 'SDE II', standardRank: 4 },
    { companyUuid: amazon.companyUuid, companyLevel: 'SDE III', standardRank: 6 },
    { companyUuid: meta.companyUuid, companyLevel: 'E3', standardRank: 2 },
    { companyUuid: meta.companyUuid, companyLevel: 'E4', standardRank: 4 },
    { companyUuid: meta.companyUuid, companyLevel: 'E5', standardRank: 6 },
  ];

  for (const map of mappings) {
    await prisma.levelMapping.upsert({
      where: {
        companyUuid_companyLevel: {
          companyUuid: map.companyUuid,
          companyLevel: map.companyLevel
        }
      },
      update: {},
      create: map
    });
  }

  // Create realistic salaryEntries 
  const salaryEntries = [
    { baseSalary: 140000, stockGrant: 40000, bonus: 20000, totalComp: 200000, yoeTotal: 1, companyLevel: 'L3', companyUuid: google.companyUuid },
    { baseSalary: 180000, stockGrant: 80000, bonus: 30000, totalComp: 290000, yoeTotal: 3, companyLevel: 'L4', companyUuid: google.companyUuid },
    { baseSalary: 210000, stockGrant: 120000, bonus: 40000, totalComp: 370000, yoeTotal: 6, companyLevel: 'L5', companyUuid: google.companyUuid },
    { baseSalary: 135000, stockGrant: 35000, bonus: 15000, totalComp: 185000, yoeTotal: 1.5, companyLevel: 'SDE I', companyUuid: amazon.companyUuid },
    { baseSalary: 175000, stockGrant: 75000, bonus: 25000, totalComp: 275000, yoeTotal: 4, companyLevel: 'SDE II', companyUuid: amazon.companyUuid },
    { baseSalary: 145000, stockGrant: 45000, bonus: 15000, totalComp: 205000, yoeTotal: 1, companyLevel: 'E3', companyUuid: meta.companyUuid },
    { baseSalary: 185000, stockGrant: 85000, bonus: 30000, totalComp: 300000, yoeTotal: 3.5, companyLevel: 'E4', companyUuid: meta.companyUuid },
  ];

  for (const entry of salaryEntries) {
    await prisma.salaryRecord.create({
      data: entry
    });
  }

  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
