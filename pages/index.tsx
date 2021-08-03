import React, { useEffect, useState } from 'react';
import DrinkModal from '../component/DrinkModal';
import axios from 'axios';
import { useSession, getSession } from 'next-auth/client';
import { GetServerSideProps } from 'next';
import { PrismaClient } from '@prisma/client';
import LoginBar from '../component/LoginBar';
import InfiniteScroll from 'react-infinite-scroll-component';

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

const generateURL = (ingredients: string[], pageIdx: number): string => {
    let base = "api/get-drinks-by-ingredients?ingredients=";
    base += ingredients.join(",");
    base += '&idx=' + pageIdx;
    return base;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const prisma = new PrismaClient();

    const session = await getSession({ req });

    const data = await prisma.userIngredient.findMany({
        where: {
            user: {
                // @ts-ignore
                email: session?.email
            }
        }
    });
    const favoriteCocktails = (await prisma.userFavorite.findMany({
        where: {
            user: {
                // @ts-ignore
                email: session?.email
            }
        }
    })).map(p => p.cocktailId);


    const ingredients = data.map(data => data.name);

    return {
        props: { ingredients, favoriteCocktails },
    };
};

interface SearchProps {
    ingredients: string[];
    favoriteCocktails: number[];
}


const Index: React.FC<SearchProps> = (props: SearchProps) => {
    const [ingredients, setIngredients] = useState<string[]>(props.ingredients);
    const [favoriteCocktails, setFavoriteCocktails] = useState<number[]>(props.favoriteCocktails);
    const [input, setInput] = useState("");
    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const [session] = useSession();
    const [pageIdx, setPageIdx] = useState(0);

    useEffect(() => {
        const fetch = async () => {
            if (ingredients.length === 0) return;
            const { data } = await axios.get<Cocktail[]>(generateURL(ingredients, pageIdx));
            setCocktails(data);
        };
        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ingredients]);

    const addIngredient = (ingredient: string) => {
        if (ingredient.length === 0) return;
        const newIngredients = ingredients.concat([ingredient]);
        setPageIdx(0);
        setCocktails([]);
        setIngredients(newIngredients);

        if (!session) return;
        try {
            axios.post('/api/add-ingredient-to-account', { ingredient });
        } catch (err) {
            console.error(err);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            addIngredient(input);
            setInput("");
        }
    };

    const removeIngredient = (ingredient: string) => {
        const newIngredients = ingredients.filter(i => i !== ingredient);
        setPageIdx(0);
        setCocktails([]);
        setIngredients(newIngredients);

        if (!session) return;
        try {
            axios.post('/api/remove-ingredient-from-account', { ingredient });
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMore = async () => {
        setPageIdx(pageIdx + 1);
        const { data } = await axios.get<Cocktail[]>(generateURL(ingredients, pageIdx));
        const newArr = cocktails.concat(data);
        setCocktails(newArr);
    };

    const ShowResults: React.FC = () => {
        if (cocktails.length === 0) return null;

        return (
            <InfiniteScroll
                dataLength={cocktails.length}
                next={fetchMore}
                hasMore={true}
                loader={<p>Loading...</p>}
            >
                <div className="flex flex-wrap gap-2 mx-auto justify-center">
                    {cocktails.map((drink) =>
                        <DrinkModal
                            key={drink.id}
                            cocktail={drink}
                            available={ingredients}
                            favorites={favoriteCocktails}
                            addFavorite={(e) => setFavoriteCocktails(favoriteCocktails.concat([e]))}
                            removeFavorite={(e) => setFavoriteCocktails(favoriteCocktails.filter(i => i !== e))}
                        />)}
                </div>
            </InfiniteScroll>

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
        <div className="min-h-screen flex flex-col">
            <LoginBar />
            <div className="flex-grow flex flex-col gap-2 bg-gradient-to-tr from-red-500 to-yellow-300 py-3 items-center">
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
        </div>
    );
};

export default Index;