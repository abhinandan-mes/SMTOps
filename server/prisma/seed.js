const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Seed Teams
  const teamsData = [
    { name: 'MES & AOI Team', code: 'MES_AOI', description: 'Manufacturing Execution Systems and Automated Optical Inspection' },
    { name: 'Application Team', code: 'APP', description: 'Application Support and Development' },
    { name: 'Equipment Team', code: 'EQUIP', description: 'Hardware and Equipment Maintenance' }
  ];

  for (const team of teamsData) {
    const existingTeam = await prisma.team.findUnique({ where: { name: team.name } });
    if (!existingTeam) {
      await prisma.team.create({ data: team });
      console.log(`Created team: ${team.name}`);
    } else {
      console.log(`Team ${team.name} already exists.`);
    }
  }

  // 2. Seed Super Admin
  const adminEmpId = 'ADM001';
  const existingAdmin = await prisma.user.findUnique({ where: { employeeId: adminEmpId } });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt); // Default password

    await prisma.user.create({
      data: {
        employeeId: adminEmpId,
        name: 'System Administrator',
        email: 'admin@smtops.com',
        passwordHash,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE'
      }
    });
    console.log('Created Super Admin user (ADM001 / admin123).');
  } else {
    console.log('Super Admin already exists.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
