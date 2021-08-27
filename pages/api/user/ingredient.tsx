/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/client';
import prisma from '../../../prisma/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    if (!session) {
        res.status(401).send('Unauthorized');
        return;
    }

    const { ingredient } = req.body;
    if (Array.isArray(ingredient)) {
        res.status(400).send('Invalid query');
        return;
    }

    let data;
    if (req.method === 'DELETE') {
        data = await prisma.userIngredient.deleteMany({
            where: {
                user: {
                    email: session.user?.email,
                },
                name: ingredient
            }
        });
    } else if (req.method === 'POST') {
        data = await prisma.userIngredient.create({
            data: {
                name: ingredient,
                user: {
                    connect: {
                        email: session.user?.email ?? undefined
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
