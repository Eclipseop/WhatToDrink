/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Cocktail } from '../pages';

interface Props {
    cocktail: Cocktail
}

const DrinkModal = (props: Props) => {
    const { cocktail } = props;

    return (
        <div className="bg-white rounded-md p-1 h-auto">
            <div className="flex flex-col gap-1 w-60">
                <div className="flex gap-1">
                    <div className="w-48 h-24">
                        <img className="rounded w-full h-full" src={cocktail.image} alt={cocktail.name} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-semibold">{cocktail.name}</h1>
                        <p className="text-gray-500 text-xs">{cocktail.description}</p>
                    </div>
                </div>
                <div className="flex">
                    <ul className="list-disc list-inside px-1">
                        {cocktail.ingredients.map((ingredient) => (
                            <li key={ingredient.id}>
                                {`${ingredient.amount} ${ingredient.name}`}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
};

export default DrinkModal;