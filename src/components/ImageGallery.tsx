import React, { useState, useEffect, useCallback, useMemo, useRef } from 'preact/compat'
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Download, Zoom } from "yet-another-react-lightbox/plugins";
import FlexGridContainer from '../components/FlexGridContainer'
import MasonryContainer from '../components/MasonryContainer'
import type { ResponsiveImage } from 'src/util/ResponsiveImage'
import Image2 from './Image2'
import browserHistory from 'src/util/history';

interface Props {
	images: ResponsiveImage[]
	imageCaptions?: string[]
	gridSize?: { [key: string]: string }
	title?: string
	imageCaption?: string
	masonry?: boolean
}

/**
 * A gallery of responsive images which can be clicked to open them in a lightbox.
 * 
 * We use URL navigation for lightbox navigation so the browser back button works.
 */
const ImageGallery: React.FC<Props> = ({ images, imageCaptions, gridSize, title, imageCaption, masonry }: Props) => {
	const [lightboxOpen, setLightboxOpen] = useState(false)
	const [selectedImage, setSelectedImage] = useState(0)
	const [directLinked, setDirectLinked] = useState(false)

	const history = useRef(browserHistory)

	useEffect(() => {
		if (!history) return;
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
			setSelectedImage(parseInt(searchParams.get('image') || '0'))
			setLightboxOpen(true)
		} else {
			setLightboxOpen(false)
		}
	}, [])

	const openLightbox = (useCallback(
		(imageIndex: number, event: any) => {
			if (!history) return;
			event.preventDefault()
			history.current?.push({
				pathname: history.current?.location.pathname,
				search: `?image=${imageIndex}`,
			}, { lightboxOpen: true })
		},
		[history]
	))

	const closeLightbox = useCallback(() =>
		(history && (!directLinked ? history.current?.back() : history.current?.replace({ pathname: history.current?.location.pathname, search: '' })))
		, [history])

	const gotoLightboxImage = useCallback(
		(imageIndex: number) => {
			if (!history) return;
			history.current?.replace({
				pathname: history.current?.location.pathname,
				search: `?image=${imageIndex}`,
			}, { lightboxOpen: true })
		},
		[history]
	)

	const getImageCaption = useCallback((imageIndex: number) => imageCaptions && imageCaptions[imageIndex], [imageCaptions])

	const imageElements = images && useMemo(
		() =>
			images.map((responsiveImage, imageIndex) => (
				<a
					style={{ cursor: 'pointer', display: 'block', height: '100%', width: !masonry ? '400px' : 'auto' }}
					key={imageIndex}
					onClick={(e) => openLightbox(imageIndex, e)}
				>
					<Image2 responsiveImage={responsiveImage} />
				</a>
			)),
		[images, openLightbox]
	)

	return (
		<>
			{!masonry && (
				<FlexGridContainer {...gridSize} maxWidth="600px">
					{imageElements}
				</FlexGridContainer>
			)}
			{masonry && <MasonryContainer columns={Math.max(2, Math.min(Math.floor(imageElements.length / 2), 6))}>{imageElements}</MasonryContainer>}
			{lightboxOpen && (
				<Lightbox
					index={selectedImage}
					on={{ view: ({ index: currentIndex }) => gotoLightboxImage(currentIndex) }}
					open={lightboxOpen}
					close={closeLightbox}
					slides={images.map((image) => (
						{
							src: image.images['3200'],
							srcSet: Object.entries(image.images).map((entry) => (
								{
									src: entry[1],
									width: parseInt(entry[0]),
									height: parseInt(entry[0]) * 0.66
								}
							))
						}
					))}
					plugins={[Download, Zoom]}
					zoom={{
						scrollToZoom: true
					}}
					render={{
						slideHeader: () => <div style={{ position: "absolute", padding: "8px", top: "0px" }}><h2>{title}</h2></div>,
						slideFooter: () => <div style={{ position: "absolute", padding: "8px", bottom: "0px" }}><h4>{imageCaptions ? getImageCaption(selectedImage) : imageCaption}</h4></div>,
					}}
				/>
			)}
		</>
	)
}

export default ImageGallery

