import { useRouter } from 'next/dist/client/router';
import React from 'react';
import useSWR from 'swr';
import { Cocktail } from '..';
import DrinkModal from '../../component/DrinkModal';
import Head from 'next/head';

const fetcher = (url: string): Promise<Cocktail> => fetch(url).then(res => res.json());

const Drink = () => {
    const { drink } = useRouter().query;
    if (!drink) return <div>Drink not found</div>;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, error } = useSWR('/api/get-drink?drinkId=' + drink, fetcher);

    if (!data || error) return <p>{error}</p>;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tr from-red-500 to-yellow-300">
            <Head>
                <title>{data.name} | WhatToDrink</title>
                <meta property="og:title" content="Home | WhatToDrink" key="title" />
            </Head>
            <div className="m-auto w-1/2">
                <DrinkModal cocktail={data} displayFullDesc={true} />
            </div>
        </div>
    );
};

export default Drink;