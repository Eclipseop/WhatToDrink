import React from 'react';
import { faCoffee, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn, signOut, useSession } from 'next-auth/client';
import Image from 'next/image';
// @ts-ignore
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import searchIngredients from './ingredients';
import Link from 'next/link';

interface Props {
    smallSidebar: boolean;
    ingredients: string[];
    addIngredient: (ingredient: string) => void;
    removeIngredient: (ingredient: string) => void;
    showFavorites: boolean;
    setShowFavorites: (showFavorites: boolean) => void;
}

const Sidebar = ({ smallSidebar, ingredients, addIngredient, removeIngredient, showFavorites, setShowFavorites }: Props) => {
    const [session] = useSession();
    const avatar = session?.user?.image;

    const handleCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.checked;
        if (val) {
            addIngredient(e.target.id);
        } else {
            removeIngredient(e.target.id);
        }
    };

    const IngredientsSection = () => {
        return (
            <div className="mt-6">
                {
                    smallSidebar ?
                        <FontAwesomeIcon icon={faCoffee} className="h-[16px] hover:text-red-300" />
                        :
                        <>
                            <div className="flex flex-row items-center gap-1">
                                <FontAwesomeIcon icon={faCoffee} className="h-[16px]" />
                                <h1>Ingredients</h1>
                            </div>
                
                            <ReactSearchAutocomplete
                                items={searchIngredients}
                                onSelect={(e: {name: string, id: number}) => addIngredient(e.name)}
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
                        </>
                }
                
                
            </div>
        );
    };

    const FavoritesSection = () => {
        return (
            <div className="mt-6">
                {
                    smallSidebar ?
                        <FontAwesomeIcon icon={faStar} className="h-[16px] hover:text-red-300" />
                        :
                        <>
                            <div className="flex flex-row items-center gap-1">
                                <FontAwesomeIcon icon={faStar} className="h-[16px]" />
                                <h1>Favorites</h1>
                            </div>
                            <label htmlFor="favorite"><input type="checkbox" id="favorite" name="favorite" onChange={() => setShowFavorites(!showFavorites)} checked={showFavorites}/> Show Only Favorites</label>

                        </>
                }
            </div>
        );
    };

    return (
        <div className="px-1 h-screen flex flex-col sticky top-0">
            <h1 className="font-semibold text-center">What to Drink</h1>

            <div className="font-light flex-grow">
                <div className="flex flex-col flex-grow items-center">
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
                <div className={`w-11/12 flex flex-col text-sm md:text-lg ${smallSidebar ? 'items-center' : ''}`}>
                    <IngredientsSection />
                    <FavoritesSection />
                </div>
            </div>
            <footer className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-2">
                <Link href="/privacy-policy">Privacy Policy</Link>
                <a href="https://github.com/Eclipseop/WhatToDrink" target="_blank" rel="noreferrer">GitHub</a>
            </footer>
        </div>
    );
};

export default Sidebar;