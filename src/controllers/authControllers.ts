import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
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

        await updateLastLogin(user.id);

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

// N IREI IMPLEMENTAR POR ENQUANTO POIS TODOS OS PROFESSORES SERÃO CRIADOS A PARTIR DE UMA SEED E ALUNOS NÃO ACESSARAM O SSITEMA APENAS SÃO UMA ENTIDADE
export async function register(req: Request, res: Response)  {
    res.status(200).json({ message: "Registration endpoint - to be implemented" });
}

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