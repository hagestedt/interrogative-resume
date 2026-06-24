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
                // Personal brand — Garnet system (source of truth; see hagestedt-brand-guidelines skill)
                garnet: {
                    50: '#FCF2F4',
                    100: '#F7E4E8',
                    200: '#EFC9D1',
                    300: '#D99FAD',
                    400: '#C66B7C', // accent on dark
                    500: '#A23B50', // bright / hover on light
                    600: '#7E2A3A', // PRIMARY
                    700: '#6E2233',
                    800: '#5A1A28',
                    900: '#3F1019',
                },
                ink: {
                    50: '#FAFAFA',
                    100: '#F4F4F5',
                    200: '#E4E4E7',
                    300: '#D4D4D8',
                    400: '#A1A1AA',
                    500: '#71717A',
                    600: '#52525B',
                    700: '#3F3F46',
                    800: '#27272A',
                    900: '#18181B',
                    950: '#141215', // dark canvas
                },
                // --- Legacy semantic names, REMAPPED to the Garnet dark theme. ---
                // Components still reference nature/cream/stone/accent; their VALUES now
                // point at garnet/ink so the whole site renders on-brand. Transitional —
                // the clean end-state is components using bg-garnet-*/text-ink-* directly.
                nature: {
                    950: '#141215', // canvas  (ink-950)
                    900: '#1C1A1E', // surface / card
                    800: '#232026', // surface-2 / hover
                    600: '#71717A', // neutral mid (was forest green)
                },
                cream: {
                    50:  '#FAFAFA',
                    100: '#F6E9EC', // primary text on dark
                    200: '#E4D9DC',
                    300: '#B8AEB2', // muted text
                    400: '#8C8388', // subtle text
                },
                stone: {
                    500: '#8C8388', // subtle
                    600: '#52525B',
                    700: '#423C45', // border-strong
                    800: '#322E34', // border
                    900: '#1C1A1E', // surface
                },
                accent: {
                    gold: '#C66B7C', // → garnet-400 — single accent
                    sage: '#C66B7C', // → garnet-400 — single accent
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Fraunces', 'Georgia', 'serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
            },
        },
    },
    plugins: [],
}
