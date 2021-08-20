/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

const test = async () => {
    const {data} = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    const cocktailData = data.drinks[0];

    //console.log(data.drinks[0]);
    const ingredients = [];
    for (let i = 1; i < 15; i++) {
        if (cocktailData['strIngredient' + i]) {
            const measure = cocktailData['strMeasure' + i];
            ingredients.push({
                name: cocktailData['strIngredient' + i],
                amount: measure ? measure.trim() : '',
            });
        }
    }

    const name = cocktailData.strDrink;
    const cache = await prisma.cocktail.findFirst({
        where: {
            name,
        }
    });
    if (!cache) {
        console.log(`${name} does not exist!`);
        await prisma.cocktail.create({
            data: {
                name: cocktailData.strDrink,
                description: cocktailData.strInstructions,
                image: cocktailData.strDrinkThumb,
                ingredients: {
                    create: ingredients
                }
            }
        });
    } else {
        console.log(`${name} does exist!`);
    }
    
};

for (let i = 0; i < 1000; i++) {
    test();
}
