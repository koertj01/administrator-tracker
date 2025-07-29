Prisma ORM and PostgreSQL Setup Instructions

Prerequisites





Node.js (v16 or higher)



PostgreSQL (v13 or higher) installed and running



A PostgreSQL database created for your project

Setup Steps





Install Prisma CLI

npm install prisma --save-dev



Initialize PrismaIf you haven't initialized Prisma, run:

npx prisma init



Configure Database ConnectionUpdate the .env file in your project root with your PostgreSQL connection string:

DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name?schema=public"

Replace username, password, localhost, 5432, and your_database_name with your actual PostgreSQL credentials and database name.



Apply the Prisma SchemaPlace the schema.prisma file in the prisma/ directory. Then, run the following command to create the database tables:

npx prisma migrate dev --name init

This will generate the SQL migration and apply it to your database.



Install Prisma Client

npm install @prisma/client



Generate Prisma ClientRun the following command to generate the Prisma Client based on your schema:

npx prisma generate



Seed the Database (Optional)Create a seed.ts file to populate the database with test data:

import { PrismaClient } from '@prisma/client';
import { testTeamGroups, testEvents, testAvailabilities } from './testData';

const prisma = new PrismaClient();

async function main() {
  // Seed TeamGroups and Members
  for (const group of testTeamGroups) {
    const createdGroup = await prisma.teamGroup.create({
      data: {
        name: group.name,
        members: {
          create: group.members.map(member => ({
            id: member.id,
            name: member.name,
            role: member.role,
          })),
        },
      },
    });
    console.log(`Created team group: ${createdGroup.name}`);
  }

  // Seed Events
  for (const event of testEvents) {
    await prisma.scheduleEvent.create({
      data: {
        memberId: event.memberId,
        date: event.date,
        title: event.title,
        color: event.color,
      },
    });
    console.log(`Created event: ${event.title}`);
  }

  // Seed Availabilities
  for (const availability of testAvailabilities) {
    await prisma.availability.create({
      data: {
        memberId: availability.memberId,
        date: availability.date,
        status: availability.status,
      },
    });
    console.log(`Created availability for ${availability.memberId}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

Run the seed script:

npx ts-node prisma/seed.ts



Use in Your ApplicationImport the test data and use it with your ScheduleGrid component:

import { ScheduleGrid } from './ScheduleGrid';
import { testTeamGroups, testEvents, testAvailabilities } from './testData';

const App = () => {
  return (
    <ScheduleGrid
      startDate={new Date()}
      endDate={new Date(new Date().setDate(new Date().getDate() + 6))}
      teamGroups={testTeamGroups}
      events={testEvents}
      availabilities={testAvailabilities}
      onCellClick={(data, day) => console.log('Clicked:', data, day)}
    />
  );
};

Notes





Ensure your PostgreSQL server is running before applying migrations or seeding.



The schema.prisma file defines the data structure for TeamGroup, Member, ScheduleEvent, and Availability models, matching the ScheduleGrid.types.ts structure.



The test data in testData.ts provides sample team groups, events, and availabilities for testing the ScheduleGrid component.



Adjust the DATABASE_URL in .env to match your PostgreSQL setup.



The seed script assumes you have ts-node installed (npm install ts-node --save-dev) if you're using TypeScript.