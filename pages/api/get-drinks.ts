/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../prisma/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send('Method not allowed');
        return;
    }

    const { idx } = req.query;
    const num = idx ? parseInt(idx as string) : 0;

    const data = await prisma.cocktail.findMany({
        skip: num * 25,
        take: 25,
        include: {
            ingredients: true,
        }
    });

    res.status(200).json(data);
};
