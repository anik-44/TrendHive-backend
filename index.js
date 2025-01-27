import express from 'express';
import dotenv from 'dotenv';
import authRouter from "./routes/auth.route.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/auth', authRouter)

app.get('/health', (_req, res) => {
    res.status(200).send('Server running!');
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
