/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                nature: {
                    950: '#0c0a09', // CHANGED: Deep Stone/Charcoal (Main Canvas)
                    900: '#14532d', // RETAINED: Forest Green (Card Backgrounds)
                    800: '#166534',
                    600: '#16a34a',
                },
                cream: {
                    50: '#ffffff',
                    100: '#f5f5f4', // Primary Text (Stone-100)
                    200: '#e7e5e4',
                    300: '#d6d3d1', // Muted Text (Stone-300)
                    400: '#a8a29e', // Disabled/Subtle
                },
                stone: {
                    // Explicit grays for borders and neutral elements
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917',
                },
                accent: {
                    gold: '#fcd34d',
                    sage: '#a7f3d0',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
