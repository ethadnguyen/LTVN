import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Custom color shades
        teal: {
          50: 'hsl(var(--teal-50))',
          100: 'hsl(var(--teal-100))',
          200: 'hsl(var(--teal-200))',
          300: 'hsl(var(--teal-300))',
          400: 'hsl(var(--teal-400))',
          500: 'hsl(var(--teal-500))',
          600: 'hsl(var(--teal-600))',
          700: 'hsl(var(--teal-700))',
          800: 'hsl(var(--teal-800))',
          900: 'hsl(var(--teal-900))',
          950: 'hsl(var(--teal-950))',
        },
        amber: {
          50: 'hsl(var(--amber-50))',
          100: 'hsl(var(--amber-100))',
          200: 'hsl(var(--amber-200))',
          300: 'hsl(var(--amber-300))',
          400: 'hsl(var(--amber-400))',
          500: 'hsl(var(--amber-500))',
          600: 'hsl(var(--amber-600))',
          700: 'hsl(var(--amber-700))',
          800: 'hsl(var(--amber-800))',
          900: 'hsl(var(--amber-900))',
          950: 'hsl(var(--amber-950))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      boxShadow: {
        'soft-sm': '0 2px 4px 0 hsl(var(--shadow) / 0.1)',
        'soft-md':
          '0 4px 6px -1px hsl(var(--shadow) / 0.1), 0 2px 4px -2px hsl(var(--shadow) / 0.1)',
        'soft-lg':
          '0 10px 15px -3px hsl(var(--shadow) / 0.1), 0 4px 6px -4px hsl(var(--shadow) / 0.1)',
        'soft-xl':
          '0 20px 25px -5px hsl(var(--shadow) / 0.1), 0 8px 10px -6px hsl(var(--shadow) / 0.1)',
        'soft-2xl': '0 25px 50px -12px hsl(var(--shadow) / 0.25)',
        'inner-sm': 'inset 0 2px 4px 0 hsl(var(--shadow) / 0.05)',
        'inner-md': 'inset 0 4px 6px -1px hsl(var(--shadow) / 0.1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-left': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        'slide-in-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-out-up': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-100%)' },
        },
        'slide-in-down': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-out-down': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(100%)' },
        },
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0.95)', opacity: '0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-out-left': 'slide-out-left 0.3s ease-out',
        'slide-in-up': 'slide-in-up 0.3s ease-out',
        'slide-out-up': 'slide-out-up 0.3s ease-out',
        'slide-in-down': 'slide-in-down 0.3s ease-out',
        'slide-out-down': 'slide-out-down 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'scale-out': 'scale-out 0.2s ease-out',
        'spin-slow': 'spin-slow 3s linear infinite',
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'hsl(var(--foreground))',
            a: {
              color: 'hsl(var(--primary))',
              '&:hover': {
                color: 'hsl(var(--primary) / 0.8)',
              },
            },
            h1: {
              color: 'hsl(var(--foreground))',
            },
            h2: {
              color: 'hsl(var(--foreground))',
            },
            h3: {
              color: 'hsl(var(--foreground))',
            },
            h4: {
              color: 'hsl(var(--foreground))',
            },
            blockquote: {
              color: 'hsl(var(--muted-foreground))',
              borderLeftColor: 'hsl(var(--border))',
            },
            hr: {
              borderColor: 'hsl(var(--border))',
            },
            ol: {
              li: {
                '&::marker': {
                  color: 'hsl(var(--muted-foreground))',
                },
              },
            },
            ul: {
              li: {
                '&::marker': {
                  color: 'hsl(var(--muted-foreground))',
                },
              },
            },
            strong: {
              color: 'hsl(var(--foreground))',
            },
            code: {
              color: 'hsl(var(--foreground))',
              backgroundColor: 'hsl(var(--muted) / 0.5)',
              borderRadius: '0.25rem',
              padding: '0.15rem 0.3rem',
            },
            pre: {
              backgroundColor: 'hsl(var(--muted))',
              color: 'hsl(var(--muted-foreground))',
            },
            thead: {
              borderBottomColor: 'hsl(var(--border))',
            },
            tbody: {
              tr: {
                borderBottomColor: 'hsl(var(--border))',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    animate,
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-sm': {
          textShadow: '0 1px 2px hsl(var(--shadow) / 0.1)',
        },
        '.text-shadow': {
          textShadow: '0 2px 4px hsl(var(--shadow) / 0.2)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 8px hsl(var(--shadow) / 0.25)',
        },
        '.text-gradient-primary': {
          background:
            'linear-gradient(to right, hsl(var(--primary)), hsl(var(--teal-500)))',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.text-gradient-secondary': {
          background:
            'linear-gradient(to right, hsl(var(--secondary)), hsl(var(--amber-500)))',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.bg-gradient-primary': {
          background:
            'linear-gradient(to right, hsl(var(--primary)), hsl(var(--teal-500)))',
        },
        '.bg-gradient-secondary': {
          background:
            'linear-gradient(to right, hsl(var(--secondary)), hsl(var(--amber-500)))',
        },
        '.bg-grid': {
          backgroundImage:
            'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        },
        '.bg-dots': {
          backgroundImage:
            'radial-gradient(hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
