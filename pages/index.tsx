import React, { useEffect, useState } from 'react';
import DrinkModal from '../component/DrinkModal';
import axios from 'axios';

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

const generateURL = (ingredients: string[]): string => {
    let base = "api/get-drinks-by-ingredients?ingredients=";
    base += ingredients.join(",");
    return base;
};

const Search: React.FC = () => {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [cocktails, setCocktails] = useState<Cocktail[]>([]);

    useEffect(() => {
        const fetch = async () => {
            if (ingredients.length === 0) return;
            const { data } = await axios.get<Cocktail[]>(generateURL(ingredients));
            setCocktails(data);
        };
        fetch();
    }, [ingredients]);

    const addIngredient = (ingredient: string) => {
        if (ingredient.length === 0) return;
        const newIngredients = ingredients.concat([ingredient]);
        setIngredients(newIngredients);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            addIngredient(input);
            setInput("");
        }
    };

    const removeIngredient = (ingredient: string) => {
        const newIngredients = ingredients.filter(i => i !== ingredient);
        setIngredients(newIngredients);
        if (newIngredients.length === 0) {
            setCocktails([]);
        }
    };

    const ShowResults: React.FC = () => {
        if (!cocktails) return null;

        return (
            <div className="flex flex-wrap gap-2 mx-auto justify-center">
                {cocktails.map((drink) => <DrinkModal key={drink.id} cocktail={drink} available={ingredients} />)}
            </div>
        );
    };

    interface Props {
        ingredient: string;
        remove: () => void;
    }

    const SearchInput: React.FC<Props> = (props: Props) => {
        const { ingredient, remove } = props;
        return (
            <li onClick={() => remove()} className="hover:line-through text-gray-600">{ingredient}</li>
        );
    };

    return (
        <div className="min-h-screen flex flex-col gap-2 bg-gradient-to-tr from-red-500 to-yellow-300 py-3 items-center">
            <div className="flex flex-col items-center bg-white rounded-lg w-5/6 md:w-1/2 p-1 text-center">
                <input
                    type="text"
                    placeholder="Add ingredients"
                    className="border rounded p-1 transition-width ease-out delay-100 w-1/2 focus:w-5/6 focus:outline-none text-center"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
                <ul>
                    {ingredients.map((ingredient) => (
                        <SearchInput ingredient={ingredient} remove={() => removeIngredient(ingredient)} key={ingredient} />
                    ))}
                </ul>
            </div>
            <ShowResults />
        </div>
    );
};

export default Search;