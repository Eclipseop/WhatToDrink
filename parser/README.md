Used to fetch data from [TheCocktailDB](https://www.thecocktaildb.com/) and parse it into a more workable structure.

The current code will add some duplicates. Run these SQL queries to remove:
```sql
DELETE
FROM "Cocktail" A USING "Cocktail" B
WHERE A.name = B.name AND A.id < B.id

DELETE
FROM "Ingredient"
WHERE "cocktailId" IS NULL
```
