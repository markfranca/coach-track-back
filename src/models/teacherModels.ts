import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

// Listar todos os professores
export const getAllTeachers = async () => {
    const teachers = await prisma.teacherProfile.findMany({
        include: {
            person: {
                include: {
                    user: true
                }
            }
        }
    });
    return teachers;
}

// Buscar professor por ID
export const getTeacherById = async (teacherId: number) => {
    const teacher = await prisma.teacherProfile.findUnique({
        where: { id: teacherId },
        include: {
            person: {
                include: {
                    user: true
                }
            },
            classes: {
                include: {
                    students: {
                        include: {
                            student: {
                                include: {
                                    person: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    return teacher;
}

// Criar professor (Person + TeacherProfile + User) - COM LOGIN
export const createTeacher = async (data: any) => {
    return await prisma.$transaction(async (tx) => {
        // 1. Criar Person
        const person = await tx.person.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                cpf: data.cpf,
                birthDate: data.birthDate ? new Date(data.birthDate) : null,
            }
        });

        // 2. Criar TeacherProfile
        const teacher = await tx.teacherProfile.create({
            data: {
                personId: person.id,
                specialization: data.specialization,
            }
        });

        // 3. Criar User (professor SEMPRE tem login)
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const user = await tx.user.create({
            data: {
                personId: person.id,
                email: data.email,
                password: hashedPassword,
                role: "TEACHER"
            }
        });

        // Retornar teacher com person e user
        return await tx.teacherProfile.findUnique({
            where: { id: teacher.id },
            include: {
                person: {
                    include: {
                        user: true
                    }
                }
            }
        });
    });
}

// Atualizar professor
export const updateTeacher = async (teacherId: number, data: any) => {
    return await prisma.$transaction(async (tx) => {
        const teacher = await tx.teacherProfile.findUnique({
            where: { id: teacherId }
        });

        if (!teacher) {
            throw new Error("Teacher not found");
        }

        // Atualizar Person
        if (data.name || data.email || data.phone) {
            await tx.person.update({
                where: { id: teacher.personId },
                data: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                }
            });
        }

        // Atualizar TeacherProfile
        const updatedTeacher = await tx.teacherProfile.update({
            where: { id: teacherId },
            data: {
                specialization: data.specialization,
            },
            include: {
                person: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return updatedTeacher;
    });
}

// Deletar professor
export const deleteTeacher = async (teacherId: number) => {
    const teacher = await prisma.teacherProfile.findUnique({
        where: { id: teacherId }
    });

    if (!teacher) {
        throw new Error("Teacher not found");
    }

    // Deletar Person (cascade deleta TeacherProfile e User)
    await prisma.person.delete({
        where: { id: teacher.personId }
    });

    return { message: "Teacher deleted successfully" };
}
