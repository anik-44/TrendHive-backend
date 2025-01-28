import express from 'express';
import dotenv from 'dotenv';
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.get('/health', (_req, res) => {
    res.status(200).send('Server running!');
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
