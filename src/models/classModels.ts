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
    return newClass;
    
} 

export const updateClass = async (classId: number, classData: any) => {
   const updatedClass = await prisma.class.update({
    where: { id: classId },
    data: {
        name: classData.name,
        description: classData.description,
        teacherId: classData.teacherId,
        schedule: classData.schedule,
    },
   });
   return updatedClass;
}

export const deleteClass = async (classId: number) => {
    const deletedClass = await prisma.class.delete({
        where: { id: classId },
    });
    return deletedClass;
}

export const getAllClassesByTeacherId = async (teacherId: number) => {
    const classes = await prisma.class.findMany({
        where: { teacherId },
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


export const isStudentEnrolled = async (classId: number, studentId: number) => {
    const enrollment = await prisma.classStudent.findFirst({
        where: {
            classId,
            studentId
        }
    });
    return !!enrollment;
}


export const enrollStudent = async (classId: number, studentId: number) => {
    const enrollment = await prisma.classStudent.create({
        data: {
            classId,
            studentId
        },
        include: {
            student: {
                include: {
                    person: true
                }
            },
            class: {
                include: {
                    teacher: {
                        include: {
                            person: true
                        }
                    }
                }
            }
        }
    });
    return enrollment;
}


export const removeStudent = async (classId: number, studentId: number) => {
    const enrollment = await prisma.classStudent.deleteMany({
        where: {
            classId,
            studentId
        }
    });
    return enrollment;
}

export const getClassStudents = async (classId: number) => {
    const enrollments = await prisma.classStudent.findMany({
        where: { classId },
        include: {
            student: {
                include: {
                    person: true
                }
            }
        },
        orderBy: {
            enrolledAt: 'desc'
        }
    });
    return enrollments;
}

export const countEnrolledStudents = async (classId: number) => {
    const count = await prisma.classStudent.count({
        where: { classId }
    });
    return count;
}

