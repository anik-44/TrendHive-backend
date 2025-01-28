import express from 'express';
import dotenv from 'dotenv';
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import {admin, buildAdminRouter} from "./admin/setup.js";
import {PORT} from "./config/config.js";


dotenv.config();

const start = async () => {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    const appRouter = express.Router();
    const router = buildAdminRouter(appRouter);

    app.use(admin.options.rootPath, router);

    app.use('/api/auth', authRouter)
    app.use('/api/user', userRouter)

    app.get('/health', (_req, res) => {
        res.status(200).send('Server running!');
    });

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`admin path: http://localhost:${PORT}${admin.options.rootPath}`);
    });
}

start().catch((err) => {
    console.log(err);
    process.exit(1)
})
