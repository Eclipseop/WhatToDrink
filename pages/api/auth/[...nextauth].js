import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from '../../../prisma/db';

export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],

    database: process.env.DATABASE_URL,
    adapter: PrismaAdapter(prisma),
});