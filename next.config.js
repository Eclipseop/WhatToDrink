const withPWA = require('next-pwa');

module.exports = withPWA({
    reactStrictMode: true,
    pwa: {
        dest: 'public',
    },
    images: {
        domains: ['www.thecocktaildb.com', 'cdn.discordapp.com', 'lh3.googleusercontent.com'],
    }
});
