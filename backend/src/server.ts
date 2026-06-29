import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Expense Tracker API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
