import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import {authenticate, COOKIE_SECRET, sessionStore} from "../config/config.js";
import {Database, getModelByName, Resource} from '@adminjs/prisma'
import prisma from "../db/prisma.js";

AdminJS.registerAdapter({Database, Resource})

const adminOptions = {
    resources: [{resource: {model: getModelByName("User"), client: prisma}}],
    rootPath: "/admin"
}

export const admin = new AdminJS(adminOptions)


export const buildAdminRouter = (app) => {
    return AdminJSExpress.buildAuthenticatedRouter(admin, {
        authenticate, cookieName: 'adminjs', cookiePassword: COOKIE_SECRET,
    }, app, {
        store: sessionStore, resave: true, saveUninitialized: true, secret: COOKIE_SECRET, cookie: {
            httpOnly: process.env.NODE_ENV === 'production', secure: process.env.NODE_ENV === 'production',
        }, name: 'adminjs',
    })
}

