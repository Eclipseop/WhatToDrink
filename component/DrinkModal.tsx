/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Cocktail, Ingredient } from '../pages';
import axios from 'axios';
import { useSession } from 'next-auth/client';

interface Props {
    cocktail: Cocktail;
    available: string[];
    favorites: number[];
    addFavorite: (id: number) => void;
    removeFavorite: (id: number) => void;
}

const has = (available: string[], ingredient: Ingredient): boolean => {
    for (const avail of available) {
        const ing = ingredient.name.toLowerCase();
        const avail1 = avail.toLowerCase();
        if (ing.includes(avail1)) return true;
    }

    return false;
};

const DrinkModal: React.FC<Props> = (props: Props) => {
    const { cocktail, available, favorites, addFavorite, removeFavorite } = props;
    const [session] = useSession();

    const submitAddFavorite = () => {
        try {
            addFavorite(cocktail.id);
            axios.post('/api/add-favorite', { cocktail: cocktail.id });
        } catch (error) {
            console.error(error);
        }
    };

    const submitRemoveFavorite = () => {
        try {
            removeFavorite(cocktail.id);
            axios.post('/api/remove-favorite', { cocktail: cocktail.id });
        } catch (error) {
            console.error(error);
        }
    };

    const isFavorite = (): boolean => {
        for (const fav of favorites) {
            if (fav === cocktail.id) return true;
        }

        return false;
    };

    return (
        <div className="bg-white rounded-md p-1 h-auto w-5/6 md:w-1/4 xl:w-1/6 transition delay-75 ease-out hover:shadow-xl">
            <div className="flex flex-col gap-1">
                <div className="flex gap-1 flex-col md:flex-row items-start">
                    <div className="h-24 w-24 md:h-12 md:w-12 flex-none">
                        <img className="rounded w-full h-full" src={cocktail.image + '/preview'} alt={cocktail.name} />
                    </div>
                    <div className="flex flex-col flex-grow">
                        <h1 className="font-semibold">{cocktail.name}</h1>
                        <p className="text-gray-500 text-xs">{cocktail.description}</p>
                    </div>
                    <svg
                        onClick={() => session ? (isFavorite() ? submitRemoveFavorite() : submitAddFavorite()) : alert('Please login to add favorites.')}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 flex-none fill-current
                        ${isFavorite() ? 'text-yellow-200 hover:text-gray-200' : 'text-gray-200 hover:text-yellow-200'}`}
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
                <div className="flex">
                    <ul className="list-disc list-inside px-1">
                        {cocktail.ingredients.map((ingredient) => (
                            <li key={ingredient.id} className={`${has(available, ingredient) ? null : 'text-red-500 font-semibold line-through'}`}>
                                {`${ingredient.amount === 'null' ? '' : ingredient.amount + ' '}${ingredient.name}`}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DrinkModal;