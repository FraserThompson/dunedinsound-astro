import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import preact from '@astrojs/preact'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import Icons from 'unplugin-icons/vite'
import { remarkImagesPlugin } from './src/remark-images-plugin.ts'
import sectionize from '@hbsnow/rehype-sectionize'

const ignoredDirs = ['**/media', '**/dist_media', '**/dist', '**/audio', '**/scripts', '**/docker']

// https://astro.build/config
export default defineConfig({
	integrations: [mdx({ remarkPlugins: [remarkImagesPlugin], rehypePlugins: [sectionize] }), preact({ compat: true })],
	site: 'https://dunedinsound.com',
	build: {
		rollupOptions: {
			external: ignoredDirs
		}
	},
	vite: {
		plugins: [
			vanillaExtractPlugin(),
			Icons({
				compiler: 'jsx',
				jsx: 'react'
			})
		],
		server: {
			watch: {
				ignored: ignoredDirs
			}
		}
	}
})
