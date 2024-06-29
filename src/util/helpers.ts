import { stripUnit } from "polished"
import { theme } from "src/Theme.css"

export const timeToSeconds = (str: string) => {
	const a = str.split(':')
	return a.length == 2 ? +a[0] * 60 + +a[1] : +a[0] * 60 * 60 + +a[1] * 60 + +a[2]
}

/*
  Decides when the header should change.
  If the banner element is on the page, just use the height of it.
  Otherwise do a calculation:
  - On mobile this is the window minus the headerheight * the banner height as a decimal.
  - On desktop it's just the window height * the banner height as a decimal.
*/
export const calculateScrollHeaderOffset = (window: any, modifierDesktop = 0, modifierMobile = 0) => {
  const bannerEl = document.querySelector<HTMLElement>('#top')
  const bannerHeight = stripUnit(theme.defaultBannerHeight) as number / 100 // assumes it's a vh unit
  const mobileHeaderHeight = (stripUnit(theme.headerHeightMobile) as number) + (stripUnit(theme.subheaderHeight) as number) // assumes they're px units
  if (window.innerWidth < stripUnit(theme.breakpointsXs)) {
    if (bannerEl) {
      return bannerEl.offsetHeight - mobileHeaderHeight + modifierMobile
    } else {
      return (window.innerHeight - mobileHeaderHeight + modifierMobile) * bannerHeight
    }
  } else {
    if (bannerEl) {
      return bannerEl.offsetHeight + modifierDesktop
    } else {
      return (window.innerHeight + modifierDesktop) * bannerHeight
    }
  }
}
