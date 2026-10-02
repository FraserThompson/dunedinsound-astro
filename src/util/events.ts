import type { ResponsiveImage } from "./ResponsiveImage"

// When virtualized list updates
export const updateEventName = 'virtual-window:update'

// When a shuffle filter filters
export const filterEventName = 'shuffle:filter'

// When an item in a dropdown is clicked
export const dropdownClickEventName = 'dropdown-item-click'

// When an image gallery update is triggered
export const imageGalleryUpdateEventName = 'gallery:update-triggered'

// After an imagery gallery update is triggered
export const imageGalleryUpdatedEventName = 'gallery:update-finished'

// When the mini player is toggled
export const playerContainerToggle = 'player-container:toggle'

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

export interface PlayerContainerToggleEventDetails {
	open: boolean
}
