/**
 * An image gallery lightbox intended for use with ImageGallery.
 * 
 * Props:
 *  - images: Array of images which will open in the lightbox when their index is in the
 *    'image' query param.
 *  - title (optional): Optional header
 *  - imageCaption (optional): Caption to display below image. Will use alt text if not.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'preact/hooks'
import Lightbox, { type SlideImage } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Download, Zoom } from "yet-another-react-lightbox/plugins";
import type { ResponsiveImage } from 'src/util/ResponsiveImage'
import browserHistory from 'src/util/history';
import { LightboxFooter, LightboxHeader } from './ImageGalleryLightbox.css';

interface Props {
	images: ResponsiveImage[]
	title?: string
	imageCaption?: string
}

const ImageGalleryLightbox: React.FC<Props> = ({ images, title, imageCaption }: Props) => {
	const [lightboxOpen, setLightboxOpen] = useState(false)
	const [selectedImage, setSelectedImage] = useState(undefined as number | undefined)
	const [directLinked, setDirectLinked] = useState(false)

	const zoomRef = useRef<any>(null)
	const history = useRef(browserHistory)

	useEffect(() => {
		if (!history) return
		handleURLChange(history.current?.location)
		const unlisten = history.current?.listen((location) => handleURLChange(location.location))
		return () => unlisten && unlisten()
	}, [history])

	/**
	 * When the URL params change put the correct image in the lightbox.
	 */
	const handleURLChange = useCallback((location: any) => {
		if (location.search) {
			const searchParams = new URLSearchParams(location.search)

			if (!location.state || !location.state.lightboxOpen) setDirectLinked(true) // this won't be set if we come direct to the url

			const selectedImage = searchParams.get('image')
			selectedImage && setSelectedImage(parseInt(selectedImage))

			setLightboxOpen(true)
		} else {
			setLightboxOpen(false)
		}
	}, [])

	const closeLightbox = useCallback(() => {
		if (!history) return
		if (!directLinked) {
			history.current?.back()
		} else {
			history.current?.replace({ pathname: history.current?.location.pathname, hash: history.current?.location.hash, search: '' })
		}
	}, [history])

	const onImageView = useCallback(
		(imageIndex: number) => {

			// On small screens zoom it in a bit by default
			if (window.innerWidth < 768) {
				setTimeout(() => {
					zoomRef.current?.changeZoom(2)
				})
			}

			if (!history || !!selectedImage) return

			history.current?.replace({
				pathname: history.current?.location.pathname,
				hash: history.current?.location.hash,
				search: `?image=${imageIndex}`,
			}, { lightboxOpen: true })
		},
		[history, zoomRef]
	)

	const imageSlides: SlideImage[] = useMemo(() => images.map((image) => (
		{
			src: image.images['3200'],
			alt: image.alt,
			width: 3200,
			height: 2113
		}
	)), [images])

	return (
		<Lightbox
			open={lightboxOpen}
			index={selectedImage}
			on={{
				view: ({ index: currentIndex }) => onImageView(currentIndex),
				exiting: () => closeLightbox()
			}}
			slides={imageSlides}
			plugins={[Download, Zoom]}
			zoom={{
				scrollToZoom: true,
				ref: zoomRef
			}}
			render={{
				iconLoading: () => <div className="spinner"></div>,
				slideHeader: () => <div className={LightboxHeader}><h2>{title}</h2></div>,
				slideFooter: ({ slide }) => <div className={LightboxFooter}><h4>{('alt' in slide && slide.alt) || imageCaption}</h4></div>,
			}}
		/>
	)
}

export default ImageGalleryLightbox

