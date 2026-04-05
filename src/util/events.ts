import type { PlayerAudio } from "./collection"
import type { ResponsiveImage } from "./ResponsiveImage"

export const updateEventName = 'virtual-window:update'
export const filterEventName = 'shuffle:filter'
export const dropdownClickEventName = 'dropdown-item-click'
export const imageGalleryUpdateEventName = 'gallery:update-triggered'
export const imageGalleryUpdatedEventName = 'gallery:update-finished'
export const playerTrackChange = 'player:select'

export interface UpdateEventDetails {
	visibleCells: HTMLElement[]
	allCells?: HTMLElement[]
}

export interface FilterEventDetails {
	items: HTMLElement[]
	searchValue: string
	filteredItems: HTMLElement[]
}

export interface ImageGalleryUpdateEventDetails {
	images: { [key: string]: ResponsiveImage }
}

export interface PlayerTrackChangeEventDetails {
	track: PlayerAudio
}
