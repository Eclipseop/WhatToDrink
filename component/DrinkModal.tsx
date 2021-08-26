import React from 'react';
import { Cocktail, Ingredient, UserFavoriteCocktail } from '../pages';
import axios from 'axios';
import { useSession } from 'next-auth/client';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

interface Props {
    cocktail: Cocktail;
    available?: string[];
    favorites?: UserFavoriteCocktail[];
    addFavorite?: (fav: UserFavoriteCocktail) => void;
    removeFavorite?: (fav: UserFavoriteCocktail) => void;
    displayFullDesc?: boolean;
}

const has = (available: string[] | undefined, ingredient: Ingredient): boolean => {
    if (!available) return true;
    for (const avail of available) {
        const ing = ingredient.name.toLowerCase();
        const avail1 = avail.toLowerCase();
        if (ing.includes(avail1)) return true;
    }

    return false;
};

const DrinkModal = ({ cocktail, available, favorites, addFavorite, removeFavorite, displayFullDesc }: Props) => {
    const [session] = useSession();

    const submitAddFavorite = () => {
        if (!addFavorite) return;
        addFavorite({
            int: cocktail.id,
            cocktailId: cocktail.id,
            userId: null,
            cocktail: cocktail,
        });
        axios.post('/api/add-favorite', { cocktail: cocktail.id }).catch(err => console.error(err));

    };

    const submitRemoveFavorite = () => {
        if (!removeFavorite) return;
        removeFavorite({
            int: cocktail.id,
            cocktailId: cocktail.id,
            userId: null,
            cocktail: cocktail,
        });
        axios.post('/api/remove-favorite', { cocktail: cocktail.id }).catch(err => console.error(err));
    };

    const isFavorite = (): boolean => {
        if (!favorites) return false;
        for (const fav of favorites) {
            if (fav.cocktailId === cocktail.id) return true;
        }

        return false;
    };

    const desc = (): string => {
        if (displayFullDesc) return cocktail.description;
        return cocktail.description.length > 130 ? cocktail.description.substring(0, 120) + '...' : cocktail.description;
    };

    return (
        <div className="bg-white rounded-md p-1 w-full transition delay-75 ease-out hover:shadow-xl">
            <div className="flex flex-col gap-1">
                <div className="flex gap-1 flex-col md:flex-row items-start">
                    <div className="h-24 w-24 md:h-12 md:w-12 flex-none">
                        <Image src={cocktail.image + '/preview'} alt={cocktail.name} width={100} height={100} className="rounded" />
                    </div>
                    <div className="flex flex-col flex-grow">
                        <a className="font-semibold transition delay-75 ease-out hover:text-yellow-500" href={`/drink/${cocktail.id}`}>{cocktail.name}</a>
                        <p className="text-gray-500 text-xs">{desc()}</p>
                    </div>
                    <FontAwesomeIcon 
                        onClick={() => session ? (isFavorite() ? submitRemoveFavorite() : submitAddFavorite()) : alert('Please login to add favorites.')}
                        className={`h-5 w-5 flex-none fill-current
                        ${isFavorite() ? 'text-yellow-300 hover:text-gray-300' : 'text-gray-300 hover:text-yellow-300'}`}
                        icon={faStar}
                    />
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