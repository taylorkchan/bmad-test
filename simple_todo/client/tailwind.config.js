/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'sans-serif'],
        'mono': ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace']
      },
      colors: {
        // CareHub Design System Palette
        teal: {
          50: '#E6F6F3',
          100: '#C0EAE3',
          200: '#97DDD1',
          300: '#6BD0C0',
          400: '#3AC1AD',
          500: '#00A287',
          600: '#008C74',
          700: '#007663',
          800: '#005C4D',
          900: '#003B30'
        },
        // Semantic Colors
        primary: {
          DEFAULT: '#00A287',
          hover: '#008C74',
          soft: '#E6F6F3'
        },
        success: {
          DEFAULT: '#34C759'
        },
        warning: {
          DEFAULT: '#FFB020'
        },
        danger: {
          DEFAULT: '#FF3B30'
        },
        info: {
          DEFAULT: '#2563EB'
        },
        // Enhanced Gray Scale
        gray: {
          25: '#FCFCFD',
          50: '#F8FAFC',
          100: '#F2F4F7',
          200: '#E4E7EC',
          300: '#D0D5DD',
          400: '#98A2B3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1D2939',
          900: '#0B1220'
        }
      },
      fontSize: {
        'display': ['40px', { lineHeight: '52px', fontWeight: '700', letterSpacing: '-0.4px' }],
        'h1': ['32px', { lineHeight: '42px', fontWeight: '700', letterSpacing: '-0.2px' }],
        'h2': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'h3': ['22px', { lineHeight: '30px', fontWeight: '600' }],
        'h4': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'bodyLg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'bodySm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'overline': ['11px', { lineHeight: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.8px' }]
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px'
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
        'pill': '9999px'
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(16,24,40,0.06)',
        'DEFAULT': '0 2px 8px rgba(16,24,40,0.08)',
        'md': '0 6px 18px rgba(16,24,40,0.12)',
        'lg': '0 14px 40px rgba(16,24,40,0.16)'
      },
      screens: {
        'xs': '360px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      },
      container: {
        center: true,
        padding: {
          'xs': '16px',
          'sm': '20px',
          'md': '24px',
          'lg': '32px',
          'xl': '40px'
        },
        screens: {
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1200px',
          '2xl': '1320px'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}

