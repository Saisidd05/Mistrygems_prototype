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
        primary: {
          DEFAULT: '#03045E',
          50: '#e8f4ff',
          100: '#c7e5ff',
          200: '#a0d0ff',
          300: '#6ab8ff',
          400: '#3a9bff',
          500: '#03045E',
          600: '#020348',
          700: '#010236',
          800: '#010126',
          900: '#000018',
        },
        secondary: {
          DEFAULT: '#0077B6',
          light: '#0096C7',
        },
        accent: {
          DEFAULT: '#00B4D8',
          light: '#48CAE4',
        },
        glass: '#90E0EF',
        highlight: '#CAF0F8',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        glass: '30px',
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '30px',
        '2xl': '40px',
        '3xl': '60px',
      },
      borderRadius: {
        glass: '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 119, 182, 0.15), inset 0 1px 0 rgba(144, 224, 239, 0.2)',
        'glass-lg': '0 20px 60px 0 rgba(3, 4, 94, 0.3), inset 0 1px 0 rgba(144, 224, 239, 0.25)',
        glow: '0 0 30px rgba(0, 180, 216, 0.4)',
        'glow-sm': '0 0 15px rgba(0, 180, 216, 0.3)',
        'glow-lg': '0 0 60px rgba(0, 180, 216, 0.5)',
        'inner-glow': 'inset 0 0 30px rgba(0, 180, 216, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 8s ease-in-out infinite 2s',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'aurora': 'aurora 15s ease-in-out infinite',
        'blob': 'blob 10s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'spin-slow': 'spin 20s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,180,216,0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(0,180,216,0.7), 0 0 100px rgba(0,180,216,0.3)' },
        },
        aurora: {
          '0%': { transform: 'translate(0%, 0%) scale(1)', opacity: '0.5' },
          '33%': { transform: 'translate(30%, -20%) scale(1.2)', opacity: '0.7' },
          '66%': { transform: 'translate(-20%, 20%) scale(0.9)', opacity: '0.4' },
          '100%': { transform: 'translate(0%, 0%) scale(1)', opacity: '0.5' },
        },
        blob: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '50% 60% 30% 60% / 40% 30% 70% 50%' },
          '75%': { borderRadius: '60% 40% 60% 30% / 30% 70% 40% 60%' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          from: { transform: 'translateY(30px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(ellipse at 20% 50%, #0077B6 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, #00B4D8 0%, transparent 50%), radial-gradient(ellipse at 50% 20%, #03045E 0%, transparent 50%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(144,224,239,0.15) 0%, rgba(0,180,216,0.05) 100%)',
        'border-gradient': 'linear-gradient(135deg, rgba(144,224,239,0.5), rgba(0,180,216,0.1))',
      },
    },
  },
  plugins: [],
}
