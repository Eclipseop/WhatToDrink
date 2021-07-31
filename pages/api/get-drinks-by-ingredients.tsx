/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send('Method not allowed');
        return;
    }

    let { ingredients: available } = req.query;
    if (!Array.isArray(available)) {
        available = available.split(',');
    }

    const data = await prisma.cocktail.findMany({
        // orderBy: {
        //     ingredients: {
        //         _count: 
        //     }
        // }
    });

    res.status(200).json(data);
};
