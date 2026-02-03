import prisma from "../lib/prisma";
import { CreateUserData, UpdateUserData, UserResponse } from "../interfaces/userInterfaces";


export const getAllUsersModel = async () => {
  const users = await prisma.user.findMany();
  return users;
}

export const getUserByIdModel = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where : { id: userId },
    });
    return user;
}

export const createUserModel = async (userData: CreateUserData): Promise<UserResponse> => {
    const newUser = await prisma.user.create({
        data: userData,
    });
    return newUser;
}

export const updateUserModel = async (userId: number, userData: UpdateUserData): Promise<UserResponse> => {
  const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
  });
  return updatedUser;
}

export const deleteUserModel = async (userId: number) => {
    const deletedUser = await prisma.user.delete({
        where: {id: userId },
    });
    return deletedUser;
}  

export const getUserByEmailModel = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    return user;
}