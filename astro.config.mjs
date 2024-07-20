import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import preact from '@astrojs/preact'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import Icons from 'unplugin-icons/vite'

// https://astro.build/config
export default defineConfig({
	integrations: [mdx(), preact({ compat: true })],
	vite: {
		plugins: [
			vanillaExtractPlugin(),
			Icons({
				compiler: 'jsx',
				jsx: 'react'
			})
		]
	}
})
