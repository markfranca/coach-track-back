import prisma from "../lib/prisma";


export const getAllStudents = async () => {
    const students = await prisma.studentProfile.findMany({
        include: {
            person: {
                include: {
                    user: true
                }
            }
        }
    });
    return students;
}

export const getStudentById = async (studentId: number) => {
    const student = await prisma.studentProfile.findUnique({
        where: { id: studentId },
        include: {
            person: {
                include: {
                    user: true
                }
            },
            attendances: {
                include: {
                    lesson: {
                        include: {
                            class: true
                        }
                    }
                }
            }
        }
    });
    return student;
}

// Criar aluno (Person + StudentProfile) - SEM LOGIN
export const createStudent = async (data: any) => {
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

        // 2. Criar StudentProfile
        const student = await tx.studentProfile.create({
            data: {
                personId: person.id,
                registrationNumber: data.registrationNumber,
                responsibleName: data.responsibleName,
                responsiblePhone: data.responsiblePhone,
                emergencyContact: data.emergencyContact,
            },
            include: {
                person: true
            }
        });

        return student;
    });
}

// Atualizar aluno
export const updateStudent = async (studentId: number, data: any) => {
    return await prisma.$transaction(async (tx) => {
        // Buscar o aluno para pegar o personId
        const student = await tx.studentProfile.findUnique({
            where: { id: studentId }
        });

        if (!student) {
            throw new Error("Student not found");
        }

        // Atualizar Person (se tiver dados pessoais)
        if (data.name || data.email || data.phone) {
            await tx.person.update({
                where: { id: student.personId },
                data: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                }
            });
        }

        // Atualizar StudentProfile
        const updatedStudent = await tx.studentProfile.update({
            where: { id: studentId },
            data: {
                responsibleName: data.responsibleName,
                responsiblePhone: data.responsiblePhone,
                emergencyContact: data.emergencyContact,
                status: data.status,
            },
            include: {
                person: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return updatedStudent;
    });
}

// Deletar aluno (cascade deleta Person também)
export const deleteStudent = async (studentId: number) => {
    const student = await prisma.studentProfile.findUnique({
        where: { id: studentId }
    });

    if (!student) {
        throw new Error("Student not found");
    }

    // Deletar Person (cascade deleta StudentProfile)
    await prisma.person.delete({
        where: { id: student.personId }
    });

    return { message: "Student deleted successfully" };
}

// Ativar acesso (criar User para Student existente)
export const activateStudentAccess = async (studentId: number, data: any) => {
    return await prisma.$transaction(async (tx) => {
        const student = await tx.studentProfile.findUnique({
            where: { id: studentId },
            include: {
                person: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!student) {
            throw new Error("Student not found");
        }

        if (student.person.user) {
            throw new Error("Student already has login access");
        }

        // Atualizar email da person (se necessário)
        await tx.person.update({
            where: { id: student.personId },
            data: { email: data.email }
        });

        // Criar User
        const user = await tx.user.create({
            data: {
                personId: student.personId,
                email: data.email,
                password: data.password,
                role: "STUDENT"
            }
        });

        return user;
    });
}