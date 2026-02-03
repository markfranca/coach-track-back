import { PrismaClient } from "../generated/prisma/client";
import prisma from "../lib/prisma";


export const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
}

export const getUserById = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where : { id: userId },
    });
    return user;
}

export const createUser = async (userData: any) => {
    const newUser = await prisma.user.create({
        data: userData,
    });
    return newUser;
}

export const updateUser = async (userId: number, userData: any) => {
  const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
  });
  return updatedUser;
}

export const deleteUser = async (userId: number) => {
    const deletedUser = await prisma.user.delete({
        where: {id: userId },
    });
    return deletedUser;
}  