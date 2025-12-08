/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                gradientShift: {
                    "0%,100%": { "background-position": "0% 50%" },
                    "50%": { "background-position": "100% 50%" },
                },
            },
            animation: {
                gradientShift: "gradientShift 6s ease infinite",
            },
            backgroundSize: {
                200: "200% 200%",
            },
        },
    },
    plugins: [],
};
