/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			// Custom colors inspired by Revolut & Freeletics
			colors: {
				// Primary brand colors
				primary: {
					50: '#e6f7ff',
					100: '#bae7ff',
					200: '#91d5ff',
					300: '#69c0ff',
					400: '#40a9ff',
					500: '#1890ff', // Main primary
					600: '#096dd9',
					700: '#0050b3',
					800: '#003a8c',
					900: '#002766'
				},
				// Accent/CTA colors (energetic orange)
				accent: {
					50: '#fff7e6',
					100: '#ffe7ba',
					200: '#ffd591',
					300: '#ffc069',
					400: '#ffa940',
					500: '#fa8c16', // Main accent
					600: '#d46b08',
					700: '#ad4e00',
					800: '#873800',
					900: '#612500'
				},
				// Success (for completed workouts, achievements)
				success: {
					light: '#95de64',
					DEFAULT: '#52c41a',
					dark: '#389e0d'
				},
				// Neutral grays (dark mode friendly)
				neutral: {
					50: '#fafafa',
					100: '#f5f5f5',
					200: '#e8e8e8',
					300: '#d9d9d9',
					400: '#bfbfbf',
					500: '#8c8c8c',
					600: '#595959',
					700: '#434343',
					800: '#262626',
					900: '#1f1f1f',
					950: '#141414'
				}
			},
			// Custom fonts (we'll use system fonts for now, can add Google Fonts later)
			fontFamily: {
				sans: [
					'Inter',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'sans-serif'
				],
				display: ['Manrope', 'Inter', 'sans-serif']
			},
			// Custom spacing for consistent layout
			spacing: {
				18: '4.5rem',
				88: '22rem',
				128: '32rem'
			},
			// Custom border radius
			borderRadius: {
				'4xl': '2rem'
			},
			// Custom shadows (subtle, modern)
			boxShadow: {
				'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
				'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
				'elevated': '0 8px 24px rgba(0, 0, 0, 0.15)'
			}
		}
	},
	plugins: []
};
