import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import React from 'react';
import { Cocktail } from '.';
import DrinkModal from '../component/DrinkModal';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const prisma = new PrismaClient();

    const session = await getSession({ req });
    if (!session) {
        return {
            props: {
                favorites: [],
            }
        };
    }
    const { user } = session;
    const data = await prisma.userFavorite.findMany({
        where: {
            //@ts-ignore
            user: {
                email: user?.email
            }
        },
        include: {
            cocktail: {
                include: {
                    ingredients: true
                }
            }
        }
    });
    console.log(data);

    return {
        props: {
            favorites: data.map((c) => c.cocktail)
        }
    };
};

interface Props {
    favorites: Cocktail[];
}

const FavoritePage: React.FC<Props> = (props: Props) => {
    const { favorites } = props;
    // console.log(favorites);
    return (
        <div className="flex flex-wrap gap-2 mx-auto justify-center">
            {favorites.map((drink) =>
                <DrinkModal
                    key={drink.id}
                    cocktail={drink}
                    favorites={favorites.map((f) => f.id)}
                />)}
        </div>
    );
};

export default FavoritePage;