import { Request, Response } from 'express';
import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    try {
        //extract email, password, name from req.body
        const { email, password, name } = req.body;

        //validate email, password (respond 400 if invaid)
        if (!email || !password) {
            return res.status(400).json({ message: "missing fields" })
        }

        //check if user with this email already exists (respond 400 if exists)
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        //generate salt and hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //create new user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        })

        //respond 201 if success
        const { password: _password, ...userWithoutPassword } = user
        return res.status(201).json({
            message: "user created",
            user: userWithoutPassword
        })
    }
    catch (error) {
        // respond 500
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // initial validation
        if (!email || !password) {
            return res.status(400).json({ message: "missing fields" })
        }
        // find user by email
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        // if does not exist 401 
        if (!user) {
            return res.status(401).json({ message: "invalid credentials" })
        }
        // compare password with bcrypt.compare
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        // if not match 400
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "invalid credentials" })
        }
        // generate jwt token with jwt.sign
        const token = jwt.sign(
            {
                id: user.id, email: user.email
            },
            process.env.JWT_SECRET || 'fallback-secret-key',
            {
                expiresIn: '24h'
            }
        )
        // resend token and user data
        const { password: _password, ...userWithoutPassword } = user;
        return res.status(200).json({
            message: "user logged in",
            token,
            user: userWithoutPassword
        })

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}