import type { MinimalEntryDefinition } from "./collection"
import type { ResponsiveImage } from "./ResponsiveImage"

export const updateEventName = 'virtual-window:update'
export const filterEventName = 'shuffle:filter'
export const dropdownClickEventName = 'dropdown-item-click'
export const imageGalleryUpdateEventName = 'gallery:update-triggered'
export const imageGalleryUpdatedEventName = 'gallery:update-finished'
export const playerLibraryPreviewEventName = 'player:library-preview-selected'

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

export interface PlayerLibraryPreviewEventDetails {
	artist: MinimalEntryDefinition
	gig: MinimalEntryDefinition
}
