import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <Provider session={pageProps.session} >
            <Component {...pageProps} />
        </Provider>
    );
};
export default MyApp;
