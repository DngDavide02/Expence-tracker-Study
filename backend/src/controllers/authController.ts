import { Request, Response } from 'express';
import prisma from '../config/prisma';
import bcrypt from 'bcrypt';

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

        // find user by email

        // if does not exist 401 

        // compare password with bcrypt.compare

        // if not match 400

        // generate jwt token with jwt.sign

        // resend tocen and user data


    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}