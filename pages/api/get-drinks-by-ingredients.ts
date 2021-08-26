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

    const { idx } = req.query;
    const num = idx ? parseInt(idx as string) : 0;
    let { ingredients } = req.query;

    if (!Array.isArray(ingredients)) {
        ingredients = ingredients.split(',');
    }

    const data = await prisma.cocktail.findMany({
        include: {
            ingredients: true
        }
    });
    data.sort((a, b) => {
        return score(ingredients, b.ingredients) - score(ingredients, a.ingredients);
    });

    const sorted = data.splice(num * 25, 25);

    console.log(`Sending to drinks on page ${idx} for ingredients ${ingredients}`);
    res.status(200).json(sorted);
};
