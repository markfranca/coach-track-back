require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"]
});

const firstNames = [
  "Ana",
  "Bruno",
  "Carla",
  "Diego",
  "Eduarda",
  "Felipe",
  "Gabriela",
  "Henrique",
  "Isabela",
  "Joao",
  "Karen",
  "Lucas",
  "Mariana",
  "Nicolas",
  "Olivia",
  "Paulo",
  "Quezia",
  "Rafael",
  "Sofia",
  "Thiago"
];

const lastNames = [
  "Almeida",
  "Barbosa",
  "Cardoso",
  "Dias",
  "Esteves",
  "Ferreira",
  "Gomes",
  "Hoffmann",
  "Ibrahim",
  "Jesus",
  "Klein",
  "Lima",
  "Moura",
  "Nascimento",
  "Oliveira",
  "Pereira",
  "Queiroz",
  "Ramos",
  "Silva",
  "Teixeira"
];

function pick(arr, index) {
  return arr[index % arr.length];
}

function padNumber(value, size) {
  return String(value).padStart(size, "0");
}

function makeCpf(index) {
  const base = 10000000000 + index;
  return String(base);
}

function makePhone(index) {
  return `+55 11 9${padNumber(1000 + index, 4)}-${padNumber(1000 + (index * 7) % 10000, 4)}`;
}

function makeBirthDate(index) {
  const year = 1998 + (index % 8);
  const month = (index % 12) + 1;
  const day = ((index * 7) % 27) + 1;
  return new Date(year, month - 1, day);
}

async function main() {
  const students = Array.from({ length: 20 }, (_, i) => {
    const first = pick(firstNames, i);
    const last = pick(lastNames, i * 3);
    const fullName = `${first} ${last}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@example.com`;

    return {
      person: {
        create: {
          name: fullName,
          email,
          phone: makePhone(i),
          cpf: makeCpf(i + 1),
          birthDate: makeBirthDate(i)
        }
      },
      registrationNumber: `REG-${padNumber(i + 1, 4)}`,
      responsibleName: `Resp ${first} ${last}`,
      responsiblePhone: makePhone(i + 20),
      emergencyContact: `Emerg ${first} ${last}`
    };
  });

  for (const data of students) {
    await prisma.studentProfile.create({ data });
  }

  // --- Create a teacher user, two classes and enroll students ---
  const teacherEmail = "professor@example.com";
  const teacherPlainPassword = "SenhaProf123!";

  // create person for teacher
  const teacherPerson = await prisma.person.create({
    data: {
      name: "Professor Exemplo",
      email: teacherEmail,
      phone: "+55 11 90000-0000",
      cpf: "99999999999",
      birthDate: new Date(1980, 0, 1)
    }
  });

  // create teacher profile
  const teacherProfile = await prisma.teacherProfile.create({
    data: {
      personId: teacherPerson.id,
      specialization: "Educação Física"
    }
  });

  // hash password and create user
  const hashed = await bcrypt.hash(teacherPlainPassword, 10);
  await prisma.user.create({
    data: {
      personId: teacherPerson.id,
      email: teacherEmail,
      password: hashed,
      role: "TEACHER"
    }
  });

  // create two classes for this teacher
  const classA = await prisma.class.create({
    data: {
      name: "Turma A - Professor Exemplo",
      description: "Turma gerada pelo seed",
      schedule: "Seg/Qua 18:00-20:00",
      startDate: new Date(),
      teacherId: teacherProfile.id
    }
  });

  const classB = await prisma.class.create({
    data: {
      name: "Turma B - Professor Exemplo",
      description: "Turma gerada pelo seed",
      schedule: "Ter/Qui 18:00-20:00",
      startDate: new Date(),
      teacherId: teacherProfile.id
    }
  });

  // fetch created students to enroll
  const createdStudents = await prisma.studentProfile.findMany({
    orderBy: { id: 'asc' },
    take: 20
  });

  // enroll first 10 in classA and next 10 in classB
  for (let i = 0; i < createdStudents.length; i++) {
    const stu = createdStudents[i];
    const targetClassId = i < 10 ? classA.id : classB.id;
    await prisma.classStudent.create({
      data: {
        classId: targetClassId,
        studentId: stu.id
      }
    });
  }

  console.log("SEED: teacher created -> email:", teacherEmail, ", password:", teacherPlainPassword);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
