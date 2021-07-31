/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed');
    return;
  }

  const data = await prisma.cocktail.findMany({
    take: 25,
    include: {
      ingredients: true,
    }
  });

  console.log(data);
  res.status(200).json(data);
};
