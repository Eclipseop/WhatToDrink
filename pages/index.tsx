import React, { useEffect, useState } from 'react';
import DrinkModal from '../component/DrinkModal';
import axios from 'axios';
import { useSession, getSession } from 'next-auth/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import prisma from '../prisma/db';
import InfiniteScroll from 'react-infinite-scroll-component';
import Sidebar from '../component/Sidebar';

export const fetcher = (url: string): Promise<Cocktail[]> => fetch(url).then(res => res.json());

export interface Cocktail {
    createdAt: string;
    description: string;
    id: number;
    image: string;
    ingredients: Ingredient[];
    name: string;
}

export interface Ingredient {
    amount: string;
    cocktailId: number;
    createdAt: string;
    id: number;
    name: string;
}

const generateURL = (ingredients: string[], pageIdx: number): string => {
    let base = 'api/drinks';
    if (!ingredients || ingredients.length === 0) {
        base += '?idx=' + pageIdx;
    } else {
        base += '?ingredients=';
        base += ingredients.join(",");
        base += '&idx=' + pageIdx;
    }

    return base;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req });
    if (!session) {
        return {
            props: {
                ingredients: [],
                favoriteCocktails: [],
            }
        };
    }
    const { user } = session;

    const data = await prisma.userIngredient.findMany({
        where: {
            user: {
                email: user?.email
            }
        }
    });
    const favoriteCocktails = (await prisma.userFavorite.findMany({
        where: {
            user: {
                email: user?.email
            }
        },
        include: {
            cocktail: true,
        }
    }));

    const ingredients = data.map(data => data.name);

    return {
        props: { ingredients, favoriteCocktails },
    };
};

export type UserFavoriteCocktail = {
    int: number;
    cocktailId: number | null;
    userId: string | null;
    cocktail: Cocktail | null;
}

interface SearchProps {
    ingredients: string[];
    favoriteCocktails: UserFavoriteCocktail[];
}

const Index = (props: SearchProps) => {
    const [ingredients, setIngredients] = useState<string[]>(props.ingredients);
    const [favoriteCocktails, setFavoriteCocktails] = useState<UserFavoriteCocktail[]>(props.favoriteCocktails);
    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const [session] = useSession();
    const [pageIdx, setPageIdx] = useState(0);
    const [shrink, setShrink] = useState(true);

    const [onlyShowFavorites, setOnlyShowFavorites] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await axios.get<Cocktail[]>(generateURL(ingredients, pageIdx));
            setCocktails(data);
        };
        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ingredients]);

    const addIngredient = (ingredient: string) => {
        if (ingredient.length === 0) return;
        const newIngredients = ingredients.concat([ingredient]);
        setPageIdx(0);
        setIngredients(newIngredients);

        if (!session) return;
        axios.post('/api/user/ingredient', { ingredient }).catch(err => console.error(err));
    };

    const removeIngredient = (ingredient: string) => {
        const newIngredients = ingredients.filter(i => i !== ingredient);
        setPageIdx(0);
        setIngredients(newIngredients);

        if (!session) return;
        axios.delete('/api/user/ingredient', {data: { ingredient }}).catch(err => console.error(err));
    };

    const fetchMore = async () => {
        setPageIdx(pageIdx + 1);
        const { data } = await axios.get<Cocktail[]>(generateURL(ingredients, pageIdx));
        const newArr = cocktails.concat(data);
        setCocktails(newArr);
    };

    const ShowResults = () => {
        if (cocktails.length === 0) return null;

        return (
            <InfiniteScroll
                dataLength={cocktails.length}
                next={fetchMore}
                hasMore={cocktails.length < 621}
                loader={<p>Loading...</p>}
            >
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center w-11/12 mx-auto gap-3">
                    {cocktails.filter((drink) => {
                        if (onlyShowFavorites) {
                            return favoriteCocktails.some(favorite => favorite.cocktailId === drink.id);
                        }
                        return true;   
                    }).map((drink) =>
                        <DrinkModal
                            key={drink.id}
                            cocktail={drink}
                            available={ingredients}
                            favorites={favoriteCocktails}
                            addFavorite={(e) => setFavoriteCocktails(favoriteCocktails.concat([e]))}
                            removeFavorite={(e) => setFavoriteCocktails(favoriteCocktails.filter(i => i.cocktailId !== e.cocktailId))}
                        />
                    )}
                </div>
            </InfiniteScroll>

        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Home | WhatToDrink</title>
                <meta property="og:title" content="Home | WhatToDrink" key="title" />
                <meta name="description" content="WhatToDrink is the best way to find new drinks! Input ingredients and see what you can make!" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <div className="flex flex-row flex-1">
                <div className="w-1/4 max-w-[14rem] flex-none">
                    <Sidebar 
                        showFavorites={onlyShowFavorites} 
                        setShowFavorites={(e) => setOnlyShowFavorites(e)} 
                        shrink={shrink} 
                        ingredients={ingredients} 
                        addIngredient={addIngredient} 
                        removeIngredient={removeIngredient} 
                    />
                </div>
                <div className="flex-grow bg-gradient-to-tr from-red-500 to-yellow-300 py-3">
                    <ShowResults />
                </div>
            </div>
        </div>
    );
};

export default Index;