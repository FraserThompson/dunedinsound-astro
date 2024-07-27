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
		<picture>
			<source type="image/webp" srcset={responsiveImage && responsiveImage.srcset} sizes="(max-width: 1920px) 100vw, 1920px"/>
			<img
				class={ImageStyle}
				src={responsiveImage ? responsiveImage.src : image}
				srcset={responsiveImage && responsiveImage.srcset}
				alt={alt}
				loading="lazy"
				decoding="async"
			/>
		</picture>
	</div>

export default Image2
