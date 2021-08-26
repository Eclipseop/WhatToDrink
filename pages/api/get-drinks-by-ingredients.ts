/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';

import { Ingredient } from '@prisma/client';
import prisma from '../../prisma/db';


const score = (available: string[] | string, required: Ingredient[]): number => {
    let temp = 0;
    for (const ingredient of required) {
        for (const avail of available) {
            if (ingredient.name.toLowerCase() === avail.toLowerCase()) {
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

    // eslint-disable-next-line prefer-const
    let { ingredients: available, idx } = req.query;
    const num = idx ? parseInt(idx as string) : 0;

    if (!Array.isArray(available)) {
        available = available.split(',');
    }

    const data = await prisma.cocktail.findMany({
        include: {
            ingredients: true
        }
    });
    data.sort((a, b) => {
        return score(available, b.ingredients) - score(available, a.ingredients);
    });

    const sorted = data.splice(num * 25, 25);

    console.log(`Sending to drinks on page ${idx} for ingredients ${available}`);
    res.status(200).json(sorted);
};
