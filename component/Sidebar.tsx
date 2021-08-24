import React, { useEffect, useState } from 'react';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn, signOut, useSession } from 'next-auth/client';
import Image from 'next/image';

const popularIngredients = [
    "Rum",
    "Gin",
    "Vodka",
    "Tequila",
    "Whiskey",
    "Scotch",
    "Brandy",
];

interface Props {
    shrink: boolean;
    ingredients: string[];
    addIngredient: (ingredient: string) => void;
    removeIngredient: (ingredient: string) => void;
}

const Sidebar = (props: Props) => {
    const [active, setActive] = useState('ingredients');
    const [textbox, setTextbox] = useState('');
    const { shrink, ingredients, addIngredient, removeIngredient } = props;
    const [session] = useSession();

    useEffect(() => {
        for (const i of ingredients) {
            if (!popularIngredients.includes(i)) {
                popularIngredients.push(i);
            }
        }
    }, [ingredients]);

    const handleCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.checked;
        if (val) {
            addIngredient(e.target.id);
        } else {
            removeIngredient(e.target.id);
        }
    };

    const handleCustomIngredient = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addIngredient(textbox);
            setTextbox('');
            popularIngredients.push(textbox);
        }
    };

    const avatar = session?.user?.image;

    return (
        <div className="pl-1 flex-col">
            <h1 className="font-semibold text-center">What to Drink</h1>

            <div className="flex-col font-light">
                <div className="flex flex-col items-center">
                    {session ? (
                        <>
                            <div>
                                <Image src={avatar ?? ''} className="rounded-full" alt="avatar" width="100px" height="100px" />
                            </div>
                            <button onClick={() => signOut()}>Sign Out</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => signIn()}>Sign In</button>
                            <p className="pr-2 text-xs text-gray-400 font-light">Sign in to save added ingredients!</p>
                        </>
                    )}
                </div>
                <div className="mt-5 flex items-center gap-1" onClick={() => setActive('ingredients')}>
                    <FontAwesomeIcon icon={faCoffee} className="h-[16px]" />
                    <h1>Ingredients</h1>
                </div>
                {
                    active === 'ingredients' ?
                        <div>
                            <input type="text" className="border rounded focus:outline-none" placeholder="Custom Ingredient" value={textbox} onChange={(e) => setTextbox(e.target.value)} onKeyDown={(e) => handleCustomIngredient(e)}></input>
                            {
                                popularIngredients.map(ingredient => (
                                    <div key={ingredient} >
                                        <label htmlFor={ingredient}><input type="checkbox" id={ingredient} name={ingredient} onChange={(e) => handleCheckboxClick(e)} checked={ingredients.includes(ingredient)}/> {ingredient} </label>
                                    </div>
                                ))
                            }
                        </div>
                        :
                        null
                }
            </div>
            
        </div>
    );
};

export default Sidebar;