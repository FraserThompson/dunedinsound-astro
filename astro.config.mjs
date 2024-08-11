import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import preact from '@astrojs/preact'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import Icons from 'unplugin-icons/vite'
import { remarkImagesPlugin } from './src/remark-images-plugin.ts'

// https://astro.build/config
export default defineConfig({
	integrations: [mdx({ remarkPlugins: [remarkImagesPlugin] }), preact({ compat: true })],
	vite: {
		plugins: [
			vanillaExtractPlugin(),
			Icons({
				compiler: 'jsx',
				jsx: 'react'
			})
		]
	},
	experimental: {
		contentCollectionCache: true
	}
})
