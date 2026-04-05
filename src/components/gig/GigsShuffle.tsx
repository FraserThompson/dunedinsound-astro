import { useEffect, useMemo, useState } from "preact/hooks"
import type { FunctionalComponent } from "preact"
import CloudBackground from '@src/components/gig/CloudBackground'
import { getRandom } from '@src/util/helpers'
import { shuffler } from '@src/util/shuffling.ts'
import { ShufflePlayerWrapper, ShuffleBottom, ShuffleWrapper, ToggleButton } from "./GigsShuffle.css"
import HeavyYoutube from "../HeavyYoutube"
import { formattedDate } from "@src/util/names"
import { AudioWrapper, CompactPlayerWrapper, WinampTitlebar } from "./CompactPlayer.css"
import { TransportButton } from "../player/PlayerTransport.css"
import { TracklistTrack, TracklistWrapper } from "../player/PlayerTracklist.css"

/**
 * A shufflable jukebox for playing random videos from random gigs.
 * 
 * There are any's everywhere because we can't import types from astro:content in the browser.
 * 
 * @param
 * @returns 
 */
const GigsJukebox: FunctionalComponent = () => {
	const [gigs, setGigs] = useState([])
	const [mode, setMode] = useState('video') // currently only video supported
	const [shuffleIndex, setShuffleIndex] = useState(0)

	const [currentGig, setCurrentGig] = useState<any | undefined>(undefined)
	const [currentArtist, setCurrentArtist] = useState<any | undefined>(undefined)

	const [currentVideo, setCurrentVideo] = useState<string | undefined>(undefined)

	// On component load fetch our big JSON blob of gigs we're shuffling (see shuffle.astro)
	useEffect(() => {
		const doTheThing = async () => {
			const gigs = await fetch('/gigs.json')
			const gigsJson = await gigs.json()
			setGigs(gigsJson)
		}
		doTheThing()
	}, [])

	// Shuffled gigs
	const shuffledGigs: any[] = useMemo(() => shuffler([...gigs]), [gigs])

	// Once we've fetched the blob, find a gig and get going
	useEffect(() => {
		if (!shuffledGigs || !shuffledGigs.length) return
		selectGig(shuffleIndex)
	}, [shuffledGigs])

	// Selects the next gig to play
	const selectGig = (shuffleIndex: number) => {
		const currentGig = shuffledGigs[shuffleIndex]

		// Filter to only the artists who have videos
		const artistsWithVids = currentGig.artists.filter((artist: any) => artist.vid)

		// We only want gigs with videos
		if (!artistsWithVids.length) {
			// Skip to next if none of them have videos
			return selectGig(shuffleIndex + 1)
		}

		// Get a random artist from this gig
		const randomArtistIndex = getRandom(0, artistsWithVids.length - 1, true)
		const gigArtist = artistsWithVids[randomArtistIndex]

		// The artist entry
		const currentArtist = currentGig.extra.artists.find((artist: any) => artist.id === gigArtist.id.id)

		// The first video from this artist
		const currentVideo = gigArtist.vid && gigArtist.vid[0].link

		setCurrentArtist(currentArtist)
		setCurrentVideo(currentVideo)
		setCurrentGig(currentGig)

		// Update the index with the one we're on
		setShuffleIndex(shuffleIndex)
	}

	return (
		<div className={`${ShuffleWrapper}`}>
			<div className={`${ShufflePlayerWrapper}`}>
				<div className={`${CompactPlayerWrapper} player`}>
					<div className={`${WinampTitlebar}`} data-title="GIG JUKEBOX"></div>
					<div style={{ margin: '5px', border: '3px groove #585662', aspectRatio: "16/9" }}>
						{mode === 'video' && currentGig && currentVideo && <HeavyYoutube videoid={currentVideo} autoplay={true} onEnded={() => selectGig(shuffleIndex + 1)} />}
					</div>
					<div className={`${AudioWrapper}`}>
						<button className={`${TransportButton} left`} disabled={shuffleIndex - 1 < 0} onClick={() => selectGig(shuffleIndex - 1)}></button>
						<button className={`${TransportButton} right`} onClick={() => selectGig(shuffleIndex + 1)}>	</button>
						<div style={{ marginLeft: 'auto' }}>
							<div className={`${mode === 'video' ? 'active' : ''} ${ToggleButton}`} onClick={() => setMode('video')} style={{ paddingLeft: '5px' }}>
								Video
							</div>
						</div>
					</div>
					{currentGig && (
						<ul className={`${TracklistWrapper}`}>
							<li className={`${TracklistTrack} noHover`}>Date: {formattedDate(new Date(currentGig.date))}</li>
							<li className={`${TracklistTrack} noHover`}>
								Gig: {currentGig.title}
								<div>
									<a href={currentGig.extra.absolutePath} title="Gig page" target="_blank" style={{ marginLeft: "10px", color: "blue" }}>
										(Go to gig page)
									</a>
								</div>
							</li>
							{currentArtist && <li className={`${TracklistTrack} noHover`}>
								Artist: {currentArtist.title || 'Unknown'}
								<div>
									<a target="_blank" title={currentArtist.title} href={`${currentArtist.extra.absolutePath}`} style={{ marginLeft: "10px", color: "blue" }}>
										{currentArtist.extra.gigCount > 1 ? `(See ${currentArtist.extra.gigCount - 1} other gigs from this artist)` : '(Go to artist page)'}
									</a>
								</div>
							</li>}
							<li className={`${TracklistTrack} noHover`}>
								Venue: {currentGig.extra.venue.data.title || 'Unknown'}
								<div>
									<a href={`/venues/${currentGig.extra.venue.id}`} title={currentGig.extra.venue.data.title} target="_blank" style={{ marginLeft: "10px", color: "blue" }}>
										(Go to venue page)
									</a>
								</div>
							</li>
						</ul>
					)}
					{!currentGig && <div className="spinner" />}
				</div>
			</div>
			<CloudBackground></CloudBackground>
			<div className={`${ShuffleBottom}`}></div>
		</div>
	)
}

export default GigsJukebox
