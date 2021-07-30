/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next'

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export default async (req: NextApiRequest, res: NextApiResponse) => {
  // const data = await prisma.cocktail.create({
  //   data: {
  //     name: 'White Russian',
  //     description: 'A classic drink from the UK',
  //     image: 'www.google.com',
  //     ingredients: {
  //       create: [
  //         {
  //           name: 'Vodka',
  //           amount: '2 oz',
  //         },
  //         {
  //           name: 'Kahlua',
  //           amount: '1 oz',
  //         },
  //         {
  //           name: 'Heavy Cream',
  //           amount: '1 splash',
  //         },
  //       ],
  //     }
  //   }
  // });

  const data = await prisma.cocktail.findMany({
    include: {
      ingredients: true,
    }
  });

  console.log(data);
  res.status(200).json(data);
}
