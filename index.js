import express from 'express';
import dotenv from 'dotenv';
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import categoryRouter from "./routes/category.route.js";
import cartRouter from "./routes/cart.route.js";
import {unknownEndpoint} from "./middleware/index.js";
import cors from 'cors';
import orderRouter from "./routes/order.routes.js";

dotenv.config();

const corsOptions = {
    origin: process.env.ORIGIN, credentials: true,
}

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions))

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders/', orderRouter)

app.get('/health', (_req, res) => {
    res.status(200).send('Server running!');
});

app.use('*', unknownEndpoint)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

