/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/client';
import prisma from '../../prisma/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method not allowed');
        return;
    }


    const { ingredient } = req.body;
    if (Array.isArray(ingredient)) {
        res.status(400).send('Invalid query');
        return;
    }

    const session = await getSession({ req });
    if (!session) {
        res.status(401).send('Unauthorized');
        return;
    }

    const data = await prisma.userIngredient.deleteMany({
        where: {
            user: {
                // @ts-ignore
                email: session?.email
            },
            name: ingredient
        }
    });
    res.status(200).json(data);
};
