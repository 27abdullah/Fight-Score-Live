/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,html}"],
    theme: {
        extend: {
            colors: {
                buttonPurple: "#535bf2",
                background: "#242424",
                headerPurple: "#978bd1",
                highlightBackground: "#1a1a1a",
            },
        },
    },
    plugins: [],
};
