import { Request, Response } from 'express';
import bycript from 'bcrypt';

import { getUserByEmailModel, createUserModel } from '../models/userModels';

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const existingUser = await getUserByEmailModel(email);

        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const passwordMatch = await bycript.compare(password, existingUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }
        res.status(200).json({ message: "Login successful" });

    }
    catch (error) {
        res.status(500).json({ error: "Failed to login" });
    }
}


export async function register (req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required" });
        }
        const existingUser = await getUserByEmailModel(email);
        if (existingUser) {
            return res.status(409).json({ error: "Email already in use" });
        }

        const hashedPassword = await bycript.hash(password, 10);
        await createUserModel({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to register user" });
    }
}
