/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			brand: {
  				green: '#135133',
  				'green-light': '#1a6b42',
  				slate: '#1e293b',
  				'slate-dark': '#0f172a',
  				'slate-light': '#334155'
  			},
  			navy: {
  				DEFAULT: '#1e293b',
  				dark: '#0f172a',
  				light: '#334155'
  			},
  			cyan: {
  				DEFAULT: '#F97316',
  				light: '#FFF7ED',
  				dark: '#EA6C0A'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1, 194 100% 43%))',
  				'2': 'hsl(var(--chart-2, 213 53% 23%))',
  				'3': 'hsl(var(--chart-3, 355 78% 56%))',
  				'4': 'hsl(var(--chart-4, 32 95% 64%))',
  				'5': 'hsl(var(--chart-5, 267 57% 36%))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			heading: ['var(--font-heading)'],
  			body: ['var(--font-body)'],
  			display: ['var(--font-display)'],
  			mono: ['var(--font-mono)']
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
  			'slide-in-right': {
  				from: { transform: 'translateX(100%)', opacity: '0' },
  				to: { transform: 'translateX(0)', opacity: '1' }
  			},
  			'fade-up': {
  				from: { transform: 'translateY(20px)', opacity: '0' },
  				to: { transform: 'translateY(0)', opacity: '1' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'slide-in-right': 'slide-in-right 0.3s ease-out',
  			'fade-up': 'fade-up 0.4s ease-out'
  		},
  		boxShadow: {
  			'card': '0 1px 2px 0 rgba(0,0,0,0.04)',
  			'card-hover': '0 4px 16px -4px rgba(0,0,0,0.08)',
  			'drawer': '-4px 0 24px rgba(0,0,0,0.06)',
  			'nav': '0 1px 0 0 hsl(var(--border))'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
