import React, { useEffect, useState } from 'react';
import { Cocktail } from '.';
import DrinkModal from '../component/DrinkModal';
import axios from 'axios';

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
        console.log('call');
        const newIngredients = ingredients.filter(i => i !== ingredient);
        setIngredients(newIngredients);
    };

    const ShowResults: React.FC = () => {
        if (!cocktails) return null;

        return (
            <div className="flex flex-wrap gap-2 p-2 mx-auto justify-center">
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
            <li onClick={() => remove()} className="hover:line-through">{ingredient}</li>
        );
    };

    return (
        <div className="h-full flex flex-col gap-2 bg-red-600">
            <div className="flex flex-col mx-auto">
                <input
                    type="text"
                    placeholder="Add ingredients"
                    className="border rounded p-1"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
                <div>
                    <ul>
                        {ingredients.map((ingredient) => (
                            <SearchInput ingredient={ingredient} remove={() => removeIngredient(ingredient)} key={ingredient} />
                        ))}
                    </ul>
                </div>
            </div>
            <ShowResults />
        </div>
    );
};

export default Search;