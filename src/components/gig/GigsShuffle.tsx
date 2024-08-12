import { useEffect, useMemo, useState } from "preact/hooks"
import { AudioWrapper, PlayerWrapper, ToggleButton, TracklistTrack, TracklistWrapper, TransportButton } from 'src/components/gig/Player.css'
import CloudBackground from 'src/components/gig/CloudBackground'
import { getRandom } from 'src/util/helpers'
import Player from 'src/components/gig/Player'
import { shuffler } from 'src/util/shuffling.ts'
import WaveSurfer from "wavesurfer.js"
import LiteYoutube from 'src/components/LiteYoutube'
import { GigsPlayerWrapper, GigsShuffleBottom, GigsShuffleWrapper, GigsTitlebar } from "./GigsShuffle.css"

interface Props {
	gigs: any[]
}

/**
 * A shufflable jukebox for playing random gigs.
 * 
 * There are any's everywhere because we can't import types from astro:content in the browser.
 * 
 * @param
 * @returns 
 */
const GigsJukebox: React.FC<Props> = ({ gigs }) => {
	const [mode, setMode] = useState('video')
	const [shuffleIndex, setShuffleIndex] = useState(0)

	const [currentGig, setCurrentGig] = useState<any | undefined>(undefined)
	const [currentArtist, setCurrentArtist] = useState<any | undefined>(undefined)

	const [currentAudio, setCurrentAudio] = useState<any | undefined>(undefined)
	const [currentVideo, setCurrentVideo] = useState<string | undefined>(undefined)

	const [wavesurfer, setWaveSurfer] = useState<WaveSurfer | undefined>(undefined)

	// Shuffled gigs
	const shuffledGigs: any[] = useMemo(() => shuffler(gigs), [gigs])

	useEffect(() => {
		const currentGig = shuffledGigs[shuffleIndex]

		// Filter to only the artists who have videos
		const artistsWithVids = currentGig.entry.data.artists.filter((artist: any) => artist.vid)

		// We only want gigs with videos and audio
		if (!artistsWithVids.length || !currentGig.extra.audio?.length) {
			// Skip to next if none of them have videos
			setShuffleIndex(shuffleIndex + 1)
			return
		}

		// Get a random artist from this gig
		const randomArtistIndex = getRandom(0, artistsWithVids.length - 1, true)
		const gigArtist = artistsWithVids[randomArtistIndex]

		// The artist entry
		const currentArtist = currentGig.extra.artists.find((artist: any) => artist.id === gigArtist.id.id)

		const currentVideo = gigArtist.vid && gigArtist.vid[0].link

		const randomAudioIndex = getRandom(0, currentGig.extra.audio.length - 1, true)
		const currentAudio = currentGig.extra.audio[randomAudioIndex]

		setCurrentAudio(currentAudio)
		setCurrentArtist(currentArtist)
		setCurrentVideo(currentVideo)

		setCurrentGig(shuffledGigs[shuffleIndex])
	}, [shuffleIndex])

	return (
		<div className={`${GigsShuffleWrapper}`}>
			<div className={`${GigsPlayerWrapper}`}>
				<div className={`${PlayerWrapper} player`}>
					<div className={`${GigsTitlebar}`}></div>
					<div style={{ margin: '5px', border: '3px groove #585662' }}>
						{mode === 'video' && currentGig && currentVideo && <LiteYoutube autoload={true} loadAPI={true} videoid={currentVideo} />}
						{mode === 'audio' && currentGig && currentAudio && (
							<Player artistAudio={[currentAudio]} barebones={true} playOnLoad={true} setWaveSurferCallback={(wavesurfer) => setWaveSurfer(wavesurfer)} />
						)}
					</div>
					<div className={`${AudioWrapper}`}>
						<button className={`${TransportButton} left`} disabled={shuffleIndex - 1 < 0} onClick={() => setShuffleIndex(shuffleIndex - 1)}></button>
						<button className={`${TransportButton} play ${mode === 'video' ? 'hidden' : ''}`} onClick={() => wavesurfer && wavesurfer.play()}></button>
						<button className={`${TransportButton} right`} onClick={() => setShuffleIndex(shuffleIndex + 1)}>	</button>
						<div style={{ marginLeft: 'auto' }}>
							<div className={`${mode === 'video' ? 'active' : ''} ${ToggleButton}`} onClick={() => setMode('video')} style={{ paddingLeft: '5px' }}>
								Video
							</div>
							{currentGig?.extra.audio && (
								<div className={`${mode === 'audo' ? 'active' : ''} ${ToggleButton}`} onClick={() => setMode('audio')}>
									Audio
								</div>
							)}
						</div>
					</div>
					{currentGig && (
						<ul className={`${TracklistWrapper}`}>
							<li className={`${TracklistTrack} noHover`}>
								Gig: {currentGig.entry.data.title}{' '}
								<a href={currentGig.extra.absolutePath} title="Gig page" target="_blank">
									(Go to gig)
								</a>
							</li>
							<li className={`${TracklistTrack} noHover`}>Date: {currentGig.entry.data.date.toLocaleDateString()}</li>
							{currentArtist && <li className={`${TracklistTrack} noHover`}>
								Artist: {currentArtist.data.title || 'Unknown'}{' '}
								<a target="_blank" href={`/artists/${currentArtist.id}`}>
									(Go to artist)
								</a>
							</li>}
							<li className={`${TracklistTrack} noHover`}>
								Venue: {currentGig.extra.venue.data.title || 'Unknown'}
								<a href={`/venues/${currentGig.extra.venue.id}`} title={currentGig.extra.venue.data.title} target="_blank">
									(Go to venue)
								</a>
							</li>
						</ul>
					)}
				</div>
			</div>
			<CloudBackground></CloudBackground>
			<div className={`${GigsShuffleBottom}`}></div>
		</div>
	)
}

export default GigsJukebox
