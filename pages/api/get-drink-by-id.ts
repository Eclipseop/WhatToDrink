/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).send('Method not allowed');
        return;
    }

    const { drinkId } = req.query;
    if (!drinkId) {
        res.status(400).send('Drink id is required');
        return;
    }

    const data = await prisma.cocktail.findFirst({
        where: {
            id: +drinkId,
        },
        include: {
            ingredients: true,
        }
    });

    res.status(200).json(data);
    
};
