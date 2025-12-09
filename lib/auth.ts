import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from '../app/generated/prisma/client'
import { nextCookies } from "better-auth/next-js";
import sendEmail from "@/helpers/sendEmail";

const prisma = new PrismaClient();


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            void sendEmail({
                to: user.email,
                subject: "Reset your password",
                text: `Click the link to reset your password: ${url}`,
            });
        },
        onPasswordReset: async ({ user }, request) => {
            // your logic here
            console.log(`Password for user ${user.email} has been reset.`);
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
        },
    },
    callbacks: {},
    plugins: [nextCookies()]
});