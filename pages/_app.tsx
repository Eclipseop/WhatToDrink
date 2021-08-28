import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';
import Head from 'next/head';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <title>Home | WhatToDrink</title>
                <meta property="og:title" content="Home | WhatToDrink" key="title" />
                <meta name="description" content="WhatToDrink is the best way to find new drinks! Input ingredients and see what you can make!" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <Provider session={pageProps.session} >
                <Component {...pageProps} />
            </Provider>
        </>
    );
};
export default MyApp;
