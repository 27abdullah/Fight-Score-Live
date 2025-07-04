/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,html}"],
    theme: {
        extend: {
            colors: {
                buttonPurple: "#535bf2",
                background: "#242424",
                headerPurple: "#978bd1",
                card: "#1a1a1a",
                rich_carmine: "#ec003f",
                dodger: "#2b7fff",
                cadmium: "#ff7d26",
                zeus: "#212121",
                dune: "#333333",
            },
        },
    },
    plugins: [],
};
