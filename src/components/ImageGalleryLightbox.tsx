/**
 * An image gallery lightbox intended for use with ImageGallery.
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'preact/compat'
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Download, Zoom } from "yet-another-react-lightbox/plugins";
import type { ResponsiveImage } from 'src/util/ResponsiveImage'
import browserHistory from 'src/util/history';

interface Props {
	images: ResponsiveImage[]
	title?: string
	imageCaption?: string
}

const ImageGalleryLightbox: React.FC<Props> = ({ images, title, imageCaption }: Props) => {
	const [lightboxOpen, setLightboxOpen] = useState(false)
	const [selectedImage, setSelectedImage] = useState(undefined as number | undefined)
	const [directLinked, setDirectLinked] = useState(false)

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
			history.current?.replace({ pathname: history.current?.location.pathname, search: '' })
		}
	}, [history])

	const onImageView = useCallback(
		(imageIndex: number) => {
			if (!history) return
			history.current?.replace({
				pathname: history.current?.location.pathname,
				search: `?image=${imageIndex}`,
			}, { lightboxOpen: true })
		},
		[history]
	)

	const getImageCaption = useCallback((imageIndex: number) => images[imageIndex].alt, [images])

	const imageSlides = useMemo(() => images.map((image) => (
		{
			src: image.images['3200'],
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
				scrollToZoom: true
			}}
			render={{
				slideHeader: () => <div style={{ position: "absolute", padding: "8px", top: "0px", zIndex: "5" }}><h2>{title}</h2></div>,
				slideFooter: () => <div style={{ position: "absolute", padding: "8px", bottom: "0px" }}><h4>{selectedImage ? getImageCaption(selectedImage) : imageCaption}</h4></div>,
			}}
		/>
	)
}

export default ImageGalleryLightbox

