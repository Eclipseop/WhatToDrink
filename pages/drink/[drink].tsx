import { useRouter } from 'next/dist/client/router';
import React from 'react';
import useSWR from 'swr';
import { Cocktail } from '..';
import DrinkModal from '../../component/DrinkModal';
import Header from '../../component/Header';

const fetcher = (url: string): Promise<Cocktail> => fetch(url).then(res => res.json());

const Drink = () => {
    const { drink } = useRouter().query;
    if (!drink) return <div>Drink not found</div>;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, error } = useSWR('/api/get-drink-by-id?drinkId=' + drink, fetcher);

    if (!data || error) return <p>{error}</p>;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tr from-red-500 to-yellow-300">
            <Header />
            <div className="m-auto w-1/2">
                <DrinkModal cocktail={data} favorites={[]} displayFullDesc={true} />
            </div>
        </div>
    );
};

export default Drink;