import prisma from '../db/prisma.js';
import bcrypt from 'bcrypt';
import {
    generateTokens, setCookies, storeRefreshToken,
} from '../utils/helper.js';
import jwt from 'jsonwebtoken';
import {redis} from '../redis/redis.js';
import {loginUserSchema, registerSchema} from '../schema/auth.schema.js';
import {z} from 'zod';

export const registerHandler = async (req, res) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const {name, email, password} = validatedData;
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return res.status(401).json({message: 'Email is already taken'});
        }

        const salt = await bcrypt.genSalt(11);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                name, email, password: hashedPassword,
            },
        });

        return res.status(201).json({
            id: newUser.id, name: newUser.name, email: newUser.email,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(401).send({error: error.issues[0].message});
        } else {
            res
                .status(501)
                .json({message: 'Internal Server Error', error: error.message});
        }
    }
};

export const loginHandler = async (req, res) => {
    try {
        const validatedData = loginUserSchema.parse(req.body);
        const {email, password} = validatedData;

        const user = await prisma.user.findUnique({
            where: {email},
        });

        if (!user) {
            return res.status(405).json({message: 'User not found'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(402).json({message: 'Invalid email or password'});
        }

        const {refreshToken, accessToken} = generateTokens(user.id);
        await storeRefreshToken(user.id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        return res.status(200).json({
            message: 'Login successful', user: {
                id: user?.id, name: user?.name, email: user?.email,
            }, // data: {
            //   refreshToken: refreshToken,
            //   accessToken: accessToken,
            // },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(401).send({error: error.issues[0].message});
        } else {
            res
                .status(501)
                .json({message: 'Internal Server Error', error: error.message});
        }
    }
};

export const logoutHandler = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`);
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({message: 'Logged out successfully'});
    } catch (error) {
        res.status(501).json({message: 'Server error', error: error.message});
    }
};
