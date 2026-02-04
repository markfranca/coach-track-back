import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateAccessToken } from "../utils/token";
import { getUserByEmail, getUserById, updateLastLogin } from '../models/userModels';

// Login
export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Atualizar último login
        await updateLastLogin(user.id);

        // Gerar token
        const token = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        res.status(200).json({ 
            message: "Login successful", 
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.person.name
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to login" });
        console.log(error);
    }
}

// Registrar professor (Person + TeacherProfile + User)
// Use createTeacher no teacherControllers ao invés disso
export async function register(req: Request, res: Response) {
    try {
        return res.status(400).json({ 
            error: "Use /teachers to create a teacher account" 
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to register user" });
    }
}

// Pegar perfil do usuário logado
export async function getMe(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userId = req.user.id;

        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            id: user.id,
            email: user.email,
            role: user.role,
            person: {
                name: user.person.name,
                email: user.person.email,
                phone: user.person.phone
            },
            profile: user.person.studentProfile || user.person.teacherProfile
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to retrieve user" });
    }
}