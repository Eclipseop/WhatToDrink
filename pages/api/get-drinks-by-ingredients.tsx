/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';

import { Ingredient, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const score = (available: string[], required: Ingredient[]): number => {
    let temp = 0;
    for (const ingredient of required) {
        for (const avail of available) {
            if (ingredient.name.toLowerCase().includes(avail.toLowerCase())) {
                temp++;
            }
        }
    }

    return temp / required.length;
};

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
        include: {
            ingredients: true
        }
    });
    data.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return score(available, b.ingredients) - score(available, a.ingredients);
    });
    const sorted = data.splice(0, 25);

    res.status(200).json(sorted);
};
