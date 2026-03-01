/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './index.html',
        './index.tsx',
        './*.tsx',
        './components/**/*.{js,ts,jsx,tsx}',
        './lib/**/*.{js,ts,jsx,tsx}',
        './services/**/*.{js,ts,jsx,tsx}',
        './context/**/*.{js,ts,jsx,tsx}',
        './data/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Fira Sans', 'Inter', 'sans-serif'],
                mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
            },
            colors: {
                background: '#030712',
                surface: '#0f172a',
                primary: '#1E40AF',
                secondary: '#3B82F6',
                accent: '#F59E0B',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
            },
            animation: {
                'blob': 'blob 7s infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        }
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                '.preserve-3d': { 'transform-style': 'preserve-3d' },
                '.perspective-2000': { 'perspective': '2000px' },
                '.rotate-x-2': { 'transform': 'rotateX(2deg)' },
                '.rotate-x-5': { 'transform': 'rotateX(5deg)' },
                '.rotate-y-n5': { 'transform': 'rotateY(-5deg)' },
                '.rotate-y-n10': { 'transform': 'rotateY(-10deg)' },
                '.translate-z-0': { 'transform': 'translateZ(0px)' },
                '.translate-z-100': { 'transform': 'translateZ(100px)' },
                '.translate-z-150': { 'transform': 'translateZ(150px)' },
                '.translate-z-200': { 'transform': 'translateZ(200px)' },
                '.translate-z-300': { 'transform': 'translateZ(300px)' },
                '.translate-z-400': { 'transform': 'translateZ(400px)' },
                '.translate-z-450': { 'transform': 'translateZ(450px)' },
                '.translate-z-500': { 'transform': 'translateZ(500px)' },
            })
        }
    ]
}
