import Connect from 'connect-pg-simple'
import session from 'express-session'
import prisma from "../db/prisma.js";

export const authenticate = async (email, password) => {
    if (email && password) {
        const user = await prisma.user.findUnique({where: {email: email}});

        if (!user) {
            return null;
        }

        if (user?.password === password && user?.role === 'Admin') {
            return Promise.resolve(user)
        } else {
            return null;
        }
    }
    return null;
}
const ConnectSession = Connect(session)
export const sessionStore = new ConnectSession({
    conObject: {
        connectionString: process.env.DIRECT_URL, ssl: process.env.NODE_ENV === 'production',
    }, tableName: 'session', createTableIfMissing: true,
})
export const COOKIE_SECRET = process.env.COOKIE_PASSWORD
export const PORT = process.env.PORT || 3000
