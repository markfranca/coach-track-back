import {Request, Response, NextFunction} from 'express';
import { verifyAccessToken } from '../utils/token';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {

        const public_paths = ['/auth/login', '/auth/register'];
        if (public_paths.includes(req.path)) {
            return next();
        }

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header missing" });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "Token missing" });
        }
        const decoded = verifyAccessToken(token);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid token" });
        }

        (req as any).user = decoded;
        next();

    }
    catch (error) {
        res.status(500).json({ error: "Authentication failed" });
    }
}