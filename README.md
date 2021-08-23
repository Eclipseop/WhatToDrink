# WhatToDrink

Given a list of ingredients, outputs various cocktails that could be made, while also highlighting the missing ingredients.

## Development
Starting up the development server
```
yarn install
yarn prisma migrate dev
yarn dev
```
Enviroment Variables
* GITHUB_CLIENT_ID
* GITHUB_CLIENT_SECRET
* NEXTAUTH_URL
* DATABASE_URL

**IMPORTANT:** Be sure to checkout the [parser](parser/README.md) to fill the database.