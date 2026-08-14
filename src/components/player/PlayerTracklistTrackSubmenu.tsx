import type { FunctionalComponent } from 'preact'
import { createPortal } from 'preact/compat'
import { useEffect, useRef, useState } from 'preact/hooks'
import type { PlayerAudio } from '@src/util/collection'
import { getEntryPath } from '@src/util/helpers'
import MoreIcon from '~icons/iconoir/more-vert'
import DownloadIcon from '~icons/iconoir/download'
import PersonIcon from '~icons/iconoir/user'
import MapIcon from '~icons/iconoir/map-pin'
import EventIcon from '~icons/iconoir/calendar'
import MinusIcon from '~icons/iconoir/minus'
import PlusIcon from '~icons/iconoir/plus'
import {
	TrackActionMenu,
	TrackActionMenuItem,
	TrackActionMenuTriggerButton,
	TrackActionMenuWrapper,
} from './PlayerTracklistTrackSubmenu.css'

const trackActionMenuOpenEventName = 'track-action-menu:open'
let trackActionMenuInstanceCounter = 0

interface Props {
	track: PlayerAudio
	isInPlaylist?: boolean
	subMenuMode?: 'playlist' | 'library'
	onAddClick?: (track: PlayerAudio) => void
	onRemoveClick?: (track: PlayerAudio) => void
	onMenuOpenChange?: (open: boolean) => void
}

const PlayerTracklistTrackSubmenu: FunctionalComponent<Props> = ({
	track,
	isInPlaylist = false,
	subMenuMode = 'playlist',
	onAddClick,
	onRemoveClick,
	onMenuOpenChange,
}) => {
	const [menuOpen, setMenuOpen] = useState(false)
	const [menuPosition, setMenuPosition] = useState<{ top: number, left: number } | null>(null)
	const menuInstanceIdRef = useRef(`track-action-menu-${trackActionMenuInstanceCounter++}`)
	const menuWrapperRef = useRef<HTMLDivElement>(null)
	const menuTriggerRef = useRef<HTMLButtonElement>(null)
	const menuPanelRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		onMenuOpenChange?.(menuOpen)
	}, [menuOpen, onMenuOpenChange])

	useEffect(() => {
		const onTrackActionMenuOpen = (event: Event) => {
			const detail = (event as CustomEvent<{ id?: string }>).detail
			if (detail?.id !== menuInstanceIdRef.current) {
				setMenuOpen(false)
			}
		}

		window.addEventListener(trackActionMenuOpenEventName, onTrackActionMenuOpen)
		return () => window.removeEventListener(trackActionMenuOpenEventName, onTrackActionMenuOpen)
	}, [])

	const updateMenuPosition = () => {
		if (!menuTriggerRef.current) return

		const triggerRect = menuTriggerRef.current.getBoundingClientRect()
		const buttonWidth = triggerRect?.width || 0

		const top = triggerRect.top
		const left = triggerRect.left + buttonWidth

		setMenuPosition({ top, left })
	}

	useEffect(() => {
		if (!menuOpen) return

		updateMenuPosition()

		const onDocumentClick = (event: MouseEvent) => {
			const target = event.target as Node
			const clickedTrigger = menuWrapperRef.current?.contains(target)
			const clickedMenu = menuPanelRef.current?.contains(target)
			if (!clickedTrigger && !clickedMenu) {
				setMenuOpen(false)
			}
		}

		const onEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setMenuOpen(false)
			}
		}

		document.addEventListener('click', onDocumentClick)
		document.addEventListener('keydown', onEscape)
		window.addEventListener('resize', updateMenuPosition)
		window.addEventListener('scroll', updateMenuPosition, true)

		return () => {
			document.removeEventListener('click', onDocumentClick)
			document.removeEventListener('keydown', onEscape)
			window.removeEventListener('resize', updateMenuPosition)
			window.removeEventListener('scroll', updateMenuPosition, true)
		}
	}, [menuOpen])

	return (
		<div
			className={TrackActionMenuWrapper}
			ref={menuWrapperRef}
			onClick={(event) => event.stopPropagation()}
		>
			<button
				type='button'
				ref={menuTriggerRef}
				className={`${TrackActionMenuTriggerButton} ${menuOpen ? 'open' : ''}`}
				title={`More actions for ${track.title}`}
				aria-label={`More actions for ${track.title}`}
				aria-haspopup='menu'
				aria-expanded={menuOpen}
				onClick={() => {
					setMenuOpen((open) => {
						const nextOpen = !open
						if (nextOpen) {
							window.dispatchEvent(new CustomEvent(trackActionMenuOpenEventName, {
								detail: { id: menuInstanceIdRef.current }
							}))
						}
						return nextOpen
					})
				}}
			>
				<MoreIcon height={'1.25rem'} />
			</button>
			{menuOpen && menuPosition && createPortal(
				<div
					ref={menuPanelRef}
					className={`${TrackActionMenu} open portal`}
					role='menu'
					style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
				>
					<a
						className={TrackActionMenuItem}
						title={'Go to venue'}
						href={track.venue && getEntryPath(track.venue?.title, 'venue')}
						role='menuitem'
					>
						<MapIcon height={'1.25rem'} />
						<span>Go to venue</span>
					</a>
					<a
						className={TrackActionMenuItem}
						title={'Go to artist'}
						href={track.artist && getEntryPath(track.artist?.title, 'artist')}
						role='menuitem'
					>
						<PersonIcon height={'1.25rem'} />
						<span>Go to artist</span>
					</a>
					{track.gig && getEntryPath(track.gig?.title, 'gig') !== window.location.pathname && <a
						className={TrackActionMenuItem}
						title={'Go to gig'}
						href={getEntryPath(track.gig.title, 'gig')}
						role='menuitem'
					>
						<EventIcon height={'1.25rem'} />
						<span>Go to gig</span>
					</a>}
					{track.files?.[0] && (<a
						className={TrackActionMenuItem}
						title={'Download MP3: ' + track.title}
						href={track.files[0]}
						target='_blank'
						role='menuitem'
						onClick={() => setMenuOpen(false)}
					>
						<DownloadIcon height={'1.25rem'} />
						<span>Download MP3</span>
					</a>)}
					{(subMenuMode === 'playlist' || isInPlaylist) && <a
						className={TrackActionMenuItem}
						style={{ backgroundColor: '#b12525', cursor: 'pointer' }}
						title={'Remove from Queue'}
						role='menuitem'
						onClick={() => {
							onRemoveClick?.(track)
							setMenuOpen(false)
						}}
					>
						<MinusIcon height={'1.25rem'} />
						<span>Remove from queue</span>
					</a>}
					{subMenuMode === 'library' && !isInPlaylist && <a
						className={TrackActionMenuItem}
						style={{ backgroundColor: '#085306', cursor: 'pointer' }}
						title={'Add to Queue'}
						role='menuitem'
						onClick={() => {
							onAddClick?.(track)
							setMenuOpen(false)
						}}
					>
						<PlusIcon height={'1.25rem'} />
						<span>Add to queue</span>
					</a>}
				</div>,
				document.body
			)}
		</div>
	)
}

export default PlayerTracklistTrackSubmenu
