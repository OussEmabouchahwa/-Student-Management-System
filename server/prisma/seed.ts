import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleStudents = [
  {
    firstName: "Amira",
    lastName: "Ben Salah",
    email: "amira.bensalah@example.edu",
    phone: "+1 555-0101",
    course: "Computer Science",
    year: 3,
    gpa: 3.85,
  },
  {
    firstName: "Marcus",
    lastName: "Vance",
    email: "marcus.vance@example.edu",
    phone: "+1 555-0102",
    course: "Mechanical Engineering",
    year: 2,
    gpa: 3.4,
  },
  {
    firstName: "Elena",
    lastName: "Rostova",
    email: "elena.rostova@example.edu",
    phone: "+1 555-0103",
    course: "Biomedical Engineering",
    year: 4,
    gpa: 3.92,
  },
  {
    firstName: "Kwame",
    lastName: "Mensah",
    email: "kwame.mensah@example.edu",
    phone: "+1 555-0104",
    course: "Civil Engineering",
    year: 1,
    gpa: 3.1,
  },
  {
    firstName: "Sunita",
    lastName: "Patel",
    email: "sunita.patel@example.edu",
    phone: "+1 555-0105",
    course: "Data Science",
    year: 3,
    gpa: 3.78,
  },
  {
    firstName: "Julian",
    lastName: "Thorne",
    email: "julian.thorne@example.edu",
    phone: "+1 555-0106",
    course: "Architecture",
    year: 5,
    gpa: 3.65,
  },
  {
    firstName: "Fatima",
    lastName: "Al-Zahra",
    email: "fatima.alzahra@example.edu",
    phone: "+1 555-0107",
    course: "Cybersecurity",
    year: 2,
    gpa: 3.9,
  },
  {
    firstName: "Liam",
    lastName: "O'Connor",
    email: "liam.oconnor@example.edu",
    phone: "+1 555-0108",
    course: "Robotics",
    year: 3,
    gpa: 2.95,
  },
  {
    firstName: "Chloe",
    lastName: "Dubois",
    email: "chloe.dubois@example.edu",
    phone: "+1 555-0109",
    course: "Electrical Engineering",
    year: 4,
    gpa: 3.82,
  },
  {
    firstName: "Kenji",
    lastName: "Takahashi",
    email: "kenji.takahashi@example.edu",
    phone: "+1 555-0110",
    course: "Aerospace Engineering",
    year: 2,
    gpa: 3.55,
  },
  {
    firstName: "Sofia",
    lastName: "Morales",
    email: "sofia.morales@example.edu",
    phone: "+1 555-0111",
    course: "Software Engineering",
    year: 1,
    gpa: 3.7,
  },
  {
    firstName: "Arlo",
    lastName: "Chen",
    email: "arlo.chen@example.edu",
    phone: "+1 555-0112",
    course: "Computer Science",
    year: 4,
    gpa: 4.0,
  },
];

export async function seed(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("Seeding database with sample students...");
  for (const student of sampleStudents) {
    await prisma.student.upsert({
      where: { email: student.email.toLowerCase() },
      update: student,
      create: {
        ...student,
        email: student.email.toLowerCase(),
      },
    });
  }
  // eslint-disable-next-line no-console
  console.log(`Seeded ${sampleStudents.length} students successfully.`);
}

if (process.env.NODE_ENV !== "test") {
  seed()
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error("Seeding failed:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
