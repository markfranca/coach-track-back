import prisma from "../lib/prisma";


export const getAllStudents = async () => {
    const students = await prisma.studentProfile.findMany();
    return students;
}

export const getStudentById = async (studentId: number) => {
    const student = await prisma.studentProfile.findUnique({
        where: { id: studentId },
    });
    return student;
}

export const createStudent = async (studentData: any) => {
    const newStudent = await prisma.studentProfile.create({
        data: studentData,
    });
    return newStudent;
}   

export const updateStudent = async (studentId: number, studentData: any) => {
    const updatedStudent = await prisma.studentProfile.update({
        where: { id: studentId },
        data: studentData,
    });
    return updatedStudent;
}

export const deleteStudent = async (studentId: number) => {
    const deletedStudent = await prisma.studentProfile.delete({
        where: { id: studentId },
    });
    return deletedStudent;
}