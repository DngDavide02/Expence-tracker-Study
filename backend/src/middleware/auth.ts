import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


// define a type that extends Request, adding user property
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}


// extract token from auth header and verify
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header('authorization');
    // if header does not exist or does not start with "Bearer" - 401
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "unauthorized" })
    }
    // extract the token
    const token = authHeader.split(' ')[1];

    // verify and attach payload to req.user (if token is valid)
    // else respond 401
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as {
            id: string;
            email: string;
        };

        req.user = {
            id: payload.id,
            email: payload.email
        }
        next();
    }
    catch {
        return res.status(401).json({ message: "Invalid or expired token" })
    }

}