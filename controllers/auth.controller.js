import prisma from "../db/prisma.js";
import bcrypt from 'bcrypt'


export const registerHandler = async (req, res) => {
    try {
        const {name, email, password} = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return res.status(400).json({message: 'Email is already taken'});
        }

        const salt = bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        });
    } catch (error) {
        res.status(500).json({message: 'Internal Server Error', error: error.message});
    }
};
