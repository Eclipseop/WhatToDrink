import React from "react";
import useSWR from "swr";
import DrinkModal from "../component/DrinkModal";

// @ts-ignore
const fetcher = (url) => fetch(url).then(res => res.json());

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

const Index = () => {
  const { data, error } = useSWR<Cocktail[]>('api/get-drinks', fetcher);

  if (error) return "Error =/";
  if (!data) return "Loading...";
  console.log(data);

  return (
    <div className="h-screen bg-red-800">
      <div className="flex gap-2 p-2 items-start">
        {data.map((drink) => <DrinkModal key={drink.id} cocktail={drink} />)}
      </div>
    </div>
  )
}

export default Index;