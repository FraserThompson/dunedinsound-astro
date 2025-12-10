export const updateEventName = 'virtual-window-update'
export const filterEventName = 'shuffle-filter'

export interface UpdateEventDetails {
	visibleCells: HTMLElement[]
	allCells?: HTMLElement[]
}

export interface FilterEventDetails {
	items: HTMLElement[]
	searchValue: string
	filteredItems: HTMLElement[]
}
