/*
	Image2: Image component for displaying responsive images via a srcset.
	Can also display regular images with the 'image' prop.
*/

import type React from "preact/compat"
import type { ResponsiveImage } from 'src/util/ResponsiveImage';
import { ImageStyle, ImageWrapper } from './Image2.css';

interface Props {
	responsiveImage?: ResponsiveImage
	image?: string
	alt?: string
}

const Image2: React.FC<Props> = ({ responsiveImage, alt, image }) =>
	<div className={ImageWrapper}>
		<div style="max-width: 800px; display: block;">
			<img alt="" role="presentation" aria-hidden="true" src="data:image/svg+xml;charset=utf-8,%3Csvg%20height='533'%20width='800'%20xmlns='http://www.w3.org/2000/svg'%20version='1.1'%3E%3C/svg%3E" style="max-width:100%;display:block;position:static" />
		</div>
		<picture>
			<source type="image/webp" srcset={responsiveImage && responsiveImage.srcset} sizes="(min-width: 800px) 800px, 100vw" />
			<img
				class={ImageStyle}
				src={responsiveImage ? responsiveImage.src : image}
				srcset={responsiveImage && responsiveImage.srcset}
				alt={alt}
				width="800"
				height="533"
				loading="lazy"
				decoding="async"
			/>
		</picture>
	</div>

export default Image2
