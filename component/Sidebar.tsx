import React, { useEffect, useState } from 'react';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn, signOut, useSession } from 'next-auth/client';
import Image from 'next/image';
// @ts-ignore
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import searchIngredients from './ingredients';

interface Props {
    shrink: boolean;
    ingredients: string[];
    addIngredient: (ingredient: string) => void;
    removeIngredient: (ingredient: string) => void;
}


const Sidebar = ({ shrink, ingredients, addIngredient, removeIngredient }: Props) => {
    const [active, setActive] = useState('ingredients');
    const [session] = useSession();

    const handleCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.checked;
        if (val) {
            addIngredient(e.target.id);
        } else {
            removeIngredient(e.target.id);
        }
    };

    const avatar = session?.user?.image;

    return (
        <div className="pl-1 flex-col sticky top-0">
            <h1 className="font-semibold text-center">What to Drink</h1>

            <div className="flex-col font-light">
                <div className="flex flex-col items-center">
                    {session ? (
                        <>
                            <div>
                                <Image src={avatar ?? ''} className="rounded-full" alt="avatar" width="100px" height="100px" />
                            </div>
                            <button className="leading-none" onClick={() => signOut()}>Sign Out</button>
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
                        <div className="w-11/12">
                            <ReactSearchAutocomplete
                                items={searchIngredients}
                                onSelect={(e: any) => addIngredient(e.name)}
                                autoFocus
                                styling={{
                                    border: '1px solid #9CA38F',
                                    borderRadius: '6px',
                                    boxShadow: 'none',
                                    height: '28px',
                                    searchIconMargin: '3px',
                                    clearIconMargin: "3px"
                                }}
                            />
                            {
                                ingredients.map(ingredient => (
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