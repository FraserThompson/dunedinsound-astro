import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import preact from '@astrojs/preact'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

// https://astro.build/config
export default defineConfig({
	integrations: [mdx(), preact({ compat: true })],
	vite: {
		plugins: [vanillaExtractPlugin()],
		ssr: {
			noExternal: ['react-icons']
		}
	}
})
