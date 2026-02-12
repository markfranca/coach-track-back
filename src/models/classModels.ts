import prisma from "../lib/prisma";

export const getAllClasses = async () => {
    const classes = await prisma.class.findMany({
        include: {
            teacher: {
                include: {
                    person: true
                }
            },
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
    });
    return classes;
}

export const getClassById = async (classId: number) => {
    
    const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: {
            teacher: {
                include: {
                    person: true
                }
            },
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
    });
    return  classData;
}

export const createClass = async (classData: any) => {
    const newClass = await prisma.class.create({
        data: {
            name: classData.name,
            description: classData.description,
            teacherId: classData.teacherId,
            schedule: classData.schedule,
            startDate: new Date()
        },
    });
    return newClass;
    
} 

export const updateClass = async (classId: number, classData: any) => {
    // Implementation for updating a class
}

export const deleteClass = async (classId: number) => {
    // Implementation for deleting a class
}