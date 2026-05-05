import prisma from "../lib/prisma";

export const getAllLessons = async () => {
  const lessons = await prisma.lesson.findMany({
    include: {
      class: {
        include: {
          teacher: {
            include: {
              person: true,
            },
          },
        },
      },
      attendances: {
        include: {
          student: {
            include: {
              person: true,
            },
          },
        },
      },
    },
  });
  return lessons;
};

export const getLessonById = async (lessonId: number) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      class: {
        include: {
          teacher: {
            include: {
              person: true,
            },
          },
        },
      },
      attendances: {
        include: {
          student: {
            include: {
              person: true,
            },
          },
        },
      },
    },
  });
  return lesson;
};

export const getLessonsByClassId = async (classId: number) => {
  const lessons = await prisma.lesson.findMany({
    where: { classId },
    include: {
      attendances: {
        include: {
          student: {
            include: {
              person: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
  return lessons;
};

export const createLesson = async (lessonData: any) => {
  const newLesson = await prisma.lesson.create({
    data: {
      classId: lessonData.classId,
      date: new Date(lessonData.date),
      topic: lessonData.topic,
      description: lessonData.description,
      duration: lessonData.duration,
    },
    include: {
      class: {
        include: {
          teacher: {
            include: {
              person: true,
            },
          },
        },
      },
      attendances: {
        include: {
          student: {
            include: {
              person: true,
            },
          },
        },
      },
    },
  });
  return newLesson;
};

export const updateLesson = async (lessonId: number, lessonData: any) => {
  const updatedLesson = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      topic: lessonData.topic,
      description: lessonData.description,
      date: lessonData.date ? new Date(lessonData.date) : undefined,
      duration: lessonData.duration,
    },
    include: {
      class: {
        include: {
          teacher: {
            include: {
              person: true,
            },
          },
        },
      },
      attendances: {
        include: {
          student: {
            include: {
              person: true,
            },
          },
        },
      },
    },
  });
  return updatedLesson;
};

export const deleteLesson = async (lessonId: number) => {
  const deletedLesson = await prisma.lesson.delete({
    where: { id: lessonId },
  });
  return deletedLesson;
};
