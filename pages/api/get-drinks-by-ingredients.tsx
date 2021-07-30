/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export default async (req: NextApiRequest, res: NextApiResponse) => {
    let { ingredients: available } = req.query;
    if (!Array.isArray(available)) {
        available = available.split(',');
    }

    const data = await prisma.cocktail.findMany({
        where: {
            ingredients: {
                some: {
                    name: {
                        in: available
                    }
                }
            }
        },
        include: {
            ingredients: true,
        }
    });

    res.status(200).json(data);
};
