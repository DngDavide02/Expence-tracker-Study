import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middleware/auth";

// GET /api/expenses
// Get the expenses for the logged in user.
export const getExpenses = async (req: AuthRequest, res: Response) => {
    try {
        const expenses = await prisma.expense.findMany({
            where: {
                userId: req.user?.id
            },
            orderBy: {
                date: 'desc'
            }
        })

        return res.status(200).json(expenses);
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

// POST /api/expenses
export const createExpense = async (req: AuthRequest, res: Response) => {
    try {
        const { title, amount, category, date, description } = req.body;
        // Validate required fields (title, amount, category, date)
        if (!title || !amount || !category || !date) {
            return res.status(400).json({ message: "missing fields" })
        }

        // Create the expense linking it to req.user.id
        const expense = await prisma.expense.create({
            data: {
                title,
                amount: parseFloat(amount),
                category,
                date: new Date(date),
                description,
                userId: req.user!.id
            }
        })
        // Respond 201 with the created expense
        return res.status(201).json(expense)
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ message: "internal server error" })
    }
}




// PUT /api/expenses/:id
// Find the expense by id
// If it doesn't exist → 404 Not Found
// If expense.userId !== req.user.id → 403 Forbidden
// Update and respond 200

// DELETE /api/expenses/:id
// Find the expense by id
// If it doesn't exist → 404 Not Found
// If expense.userId !== req.user.id → 403 Forbidden
// Delete and respond 200