/**
 * Rather than importing yet another dependency, we just have these
 * simple functions for using the History API with events.
 */

export const replaceEventName = 'replacestate'
export const pushEventName = 'pushstate'

const dispatchHistoryEvent = (url: URL, type: 'replace' | 'push') => {
	const eventName = type === 'replace' ? replaceEventName : pushEventName
	const event = new CustomEvent(eventName, { detail: url })
	document.dispatchEvent(event)
}

/**
 * Wrapper for window.history.replacestate
 * Fires {replaceEventName}
 * @param url 
 */
export const replaceState = (url: URL, state?: any) => {
	window.history.replaceState(state || window.history.state, '', url)
	dispatchHistoryEvent(url, 'replace')
}

/**
 * Wrapper for window.history.pushstate
 * Fires {pushEventName}
 * @param url 
 */
export const pushState = (url: URL, state?: any) => {
	window.history.pushState(state || window.history.state, '', url)
	dispatchHistoryEvent(url, 'push')
}
