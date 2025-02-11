import express from 'express';
import dotenv from 'dotenv';
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import {admin, buildAdminRouter} from "./admin/setup.js";
import {PORT} from "./config/config.js";
import categoryRouter from "./routes/category.route.js";
import cartRouter from "./routes/cart.route.js";
import {unknownEndpoint} from "./middleware/index.js";
import cors from 'cors';

dotenv.config();

const corsOptions = {
    origin: process.env.ORIGIN,
    credentials: true,
}

const start = async () => {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors(corsOptions))

    const appRouter = express.Router();
    const router = buildAdminRouter(appRouter);

    app.use(admin.options.rootPath, router);

    app.use('/api/auth', authRouter)
    app.use('/api/users', userRouter)
    app.use('/api/categories', categoryRouter)
    app.use('/api/cart', cartRouter)

    app.get('/health', (_req, res) => {
        res.status(200).send('Server running!');
    });

    app.use('*', unknownEndpoint)


    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`admin path: http://localhost:${PORT}${admin.options.rootPath}`);
    });
}

start().catch((err) => {
    console.log(err);
    process.exit(1)
})
