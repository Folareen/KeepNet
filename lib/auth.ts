import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from './prisma'
import { nextCookies } from "better-auth/next-js";
import sendEmail from "@/helpers/sendEmail";


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
            console.log(`Password for user ${user.email} has been reset.`);
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            redirectURI: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth/callback/google`,
        },
    },
    callbacks: {
        async onSignUp(user: any) {
            if (!user.username && user.fullName) {
                let baseUsername = user.fullName
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');

                const randomSuffix = Math.random().toString(36).substring(2, 6);
                const username = `${baseUsername}-${randomSuffix}`;

                await prisma.user.update({
                    where: { id: user.id },
                    data: { username }
                });
            }
        }
    },
    plugins: [nextCookies()]
});