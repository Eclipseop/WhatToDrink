import React from "react";
import useSWR from "swr";
import DrinkModal from "../component/DrinkModal";

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

const Index: React.FC = () => {
  const { data, error } = useSWR<Cocktail[]>('api/get-drinks', fetcher);

  if (error) return <div>Error =/</div>;
  if (!data) return <div>Loading...</div>;
  console.log(data);

  return (
    <div className="h-screen bg-red-800">
      <div className="flex gap-2 p-2 items-start flex-wrap">
        {data.map((drink) => <DrinkModal key={drink.id} cocktail={drink} />)}
      </div>
    </div>
  );
};

export default Index;