/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method not allowed');
        return;
    }

    const data = await prisma.cocktail.create({
        data: {
            name: 'Daiquiri',
            description: 'A classic daiquiri is one of the most well-balanced cocktails around.',
            image: 'www.google.com',
            ingredients: {
                create: [
                    {
                        name: 'White Rum',
                        amount: '2 oz',
                    },
                    {
                        name: 'Simple Syrup',
                        amount: '1 oz',
                    },
                    {
                        name: 'Lime Juice',
                        amount: '1 oz',
                    }
                ],
            }
        }
    });

    res.status(200).json(data);
};
