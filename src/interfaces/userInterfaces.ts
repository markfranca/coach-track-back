import { Role } from "../generated/prisma/client";



export interface CreateUserData {
    name?: string;
    email: string;
    password: string;
    role?: Role;
}

export interface UpdateUserData {
  name?: string | null;
  email?: string;
  password?: string;
  role?: Role;
}

export interface UserResponse {
    id: number;
    name: string | null;
    email: string;
    role: Role;
    password: string;
    createdAt: Date;
}
