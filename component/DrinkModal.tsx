/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Cocktail, Ingredient } from '../pages';

interface Props {
    cocktail: Cocktail;
    available: string[];
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
    const { cocktail, available } = props;

    return (
        <div className="bg-white rounded-md p-1 h-auto w-1/6">
            <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                    <div className="w-1/2 h-1/2">
                        <img className="rounded w-full h-full" src={cocktail.image + '/preview'} alt={cocktail.name} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-semibold">{cocktail.name}</h1>
                        <p className="text-gray-500 text-xs">{cocktail.description}</p>
                    </div>
                </div>
                <div className="flex">
                    <ul className="list-disc list-inside px-1">
                        {cocktail.ingredients.map((ingredient) => (
                            <li key={ingredient.id} className={`${has(available, ingredient) ? null : 'text-red-500 font-semibold'}`}>
                                {`${ingredient.amount} ${ingredient.name}`}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DrinkModal;