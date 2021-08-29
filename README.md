# WhatToDrink

A website / PWA that allows users to find their next cocktail. 

By default, the app will return a random assortment of drinks. The main focus of the app however is to have users input various ingredients and be given a list of drinks they are able to make.

## Development
Requirements: [Postgres](https://hub.docker.com/_/postgres)

Starting up the development server
```
yarn install
yarn prisma migrate dev
yarn dev
```
Enviroment Variables
* DISCORD_CLIENT_ID
* DISCORD_CLIENT_SECRET
* GOOGLE_CLIENT_ID
* GOOGLE_CLIENT_SECRET
* NEXTAUTH_URL
* DATABASE_URL

**IMPORTANT:** Be sure to checkout the [parser](parser/) to fill the database.
