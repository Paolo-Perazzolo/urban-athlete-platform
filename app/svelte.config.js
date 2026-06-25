import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Vercel adapter for deployment
		adapter: adapter()
	}
};

export default config;
