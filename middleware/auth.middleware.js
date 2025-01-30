import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({message: "Unauthorized"});
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.userId,
                },
            });
            if (!user) {
                return res.status(401).json({message: "User not found"});
            }
            req.user = user;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({message: "Unauthorized - Access token expired"});
            }
            throw error;
        }
    } catch (error) {
        return res.status(401).json({message: "Unauthorized - Invalid access token", error});
    }
};
