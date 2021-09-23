import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/client';
import prisma from '../../../prisma/db';
import NextCors from 'nextjs-cors';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await NextCors(req, res, {
        methods: ['DELETE', 'POST'],
        origin: process.env.NEXTAUTH_URL,
        optionsSuccessStatus: 200,
    });

    const session = await getSession({ req });
    if (!session) {
        res.status(401).send('Unauthorized');
        return;
    }

    const { cocktail } = req.body;
    if (Array.isArray(cocktail)) {
        res.status(400).send('Invalid query');
        return;
    }

    let data;
    if (req.method === 'DELETE') {
        data = await prisma.userFavorite.deleteMany({
            where: {
                user: {
                    email: session.user?.email,
                },
                cocktail: {
                    id: cocktail,
                }
            }
        });
    } else if (req.method === 'POST') {
        data = await prisma.userFavorite.create({
            data: {
                user: {
                    connect: {
                        email: session.user?.email ?? undefined,
                    }
                },
                cocktail: {
                    connect: {
                        id: cocktail,
                    }
                }
            }
        });
    }

    if (data) {
        res.status(200).send(data);
    } else {
        res.status(400).send('Invalid method');
    }
};
