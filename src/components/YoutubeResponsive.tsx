import type React from "preact/compat"
import { useState, useEffect, useCallback } from "preact/compat"
import YouTube from 'react-youtube'
import { FaRegPlayCircle } from 'react-icons/fa'
import { placeholderLink, placeholderOverlay, placeholderOverlayTitle, watchOnYoutubeLink, youtubeWrapper } from './YoutubeResponsive.css'

interface Props {
	videoId: string
	className?: string
	vanilla?: boolean
	getPlayerTarget?: (target: any) => any
}

const YoutubeResponsive: React.FC<Props> = ({ videoId, className, vanilla, getPlayerTarget }) => {
	const APIKey = 'AIzaSyBUlBQysAAKfuSmm4Z92VBMAE9lli3zL58'
	const [clicked, setClicked] = useState(false)
	const [title, setTitle] = useState('')
	const [thumbnail, setThumbnail] = useState(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`)

	useEffect(() => {
		getTitle()
	}, [videoId])

	const getTitle = async () => {
		let response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${APIKey}`)
		let data = await response.json()
		if (data.items && data.items.length) {
			const thumbnail = data.items[0].snippet.thumbnails.maxres ? data.items[0].snippet.thumbnails.maxres.url : data.items[0].snippet.thumbnails.high.url
			const title = data.items[0].snippet.title
			setTitle(title)
			setThumbnail(thumbnail)
		}
	}

	const onReady = useCallback(
		(event: any) => {
			event.target.setPlaybackQuality('hd720')
			event.target.playVideo() // this doesn't seem to work
			getPlayerTarget && getPlayerTarget(event.target)
		},
		[getPlayerTarget]
	)

	return (
		<div className={`${youtubeWrapper} ${className}`}>
			{!clicked && !vanilla && (
				<div>
					<a className={placeholderLink} onClick={() => setClicked(true)}>
						<img src={thumbnail} width="100%" height="auto" />
						<div className={placeholderOverlay}>
							<h4 className={placeholderOverlayTitle}>{title}</h4>
							<FaRegPlayCircle size={"8em"} />
						</div>
					</a>
					<a className={watchOnYoutubeLink} href={`https://www.youtube.com/watch?v=${videoId}`} rel="noopener" target="_blank" title="Watch video on YouTube">
						<small>Watch on YouTube</small>
					</a>
				</div>
			)}
			{(clicked || vanilla) && (
				<YouTube
					videoId={videoId}
					onReady={onReady}
					opts={{ host: 'https://www.youtube-nocookie.com', rel: 0, modestbranding: 1, playerVars: { autoplay: 1 }, height: '720', width: '1280' }}
				/>
			)}
		</div>
	)
}

export default YoutubeResponsive
