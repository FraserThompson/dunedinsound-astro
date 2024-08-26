import { style, globalStyle } from '@vanilla-extract/css'
import { theme } from 'src/Theme.css'

export const PlayerWrapper = style({
	transition: 'all 150ms ease-in-out',
	background: 'linear-gradient(to left, #1a1927 0%, #353551 53%, #21212d 100%)',
	border: theme.borders.groove,
	boxShadow: theme.borders.shadowTop
})

export const AudioWrapper = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	marginLeft: '5px',
	marginRight: '5px'
})

export const WaveWrapper = style({
	flexGrow: 1,
	border: theme.borders.groove,
	backgroundColor: 'black',
	marginLeft: '5px',
	minHeight: '65px',
	position: 'relative',
	selectors: {
		'&::part(marker)': {
			cursor: 'pointer !important',
			width: '3px !important',
			zIndex: '4 !important',
			backgroundColor: 'rgba(0, 0, 0, 0.8) !important'
		},
		'&::part(marker):hover': {
			zIndex: '5 !important',
			backgroundColor: 'rgba(0, 0, 0, 1) !important'
		},
		'&::part(region-content)': {
			content: 'attr(data-id)',
			zIndex: '4 !important',
			transition: 'background-color 100ms ease-in-out',
			position: 'absolute',
			bottom: 0,
			color: theme.color.text,
			backgroundColor: 'rgba(0, 0, 0, 0.6)',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			fontSize: '12px',
			lineHeight: '85%'
		},
		'&::part(region-content):hover': {
			backgroundColor: 'rgba(0, 0, 0, 1)',
			zIndex: '5 !important',
			maxWidth: '1000px'
		}
	}
})

globalStyle(`${WaveWrapper} wave`, {
	zIndex: 10
})

export const Titlebar = style({
	textAlign: 'left',
	backgroundColor: '#e7d1ab',
	color: '#cccfd6',
	fontSize: '12px',
	fontFamily: 'monospace',
	position: 'relative',
	marginLeft: '10px',
	marginRight: '10px',
	marginTop: '5px',
	marginBottom: '5px',
	height: '10px',
	borderRadius: '2px',
	selectors: {
		'&::before': {
			background:
				'-webkit-linear-gradient(top, #fffcdf 0%, #fffcdf 29%, #736c50 32%, #736c50 66%, #d5ceb1 69%, #d5ceb1 100%)',
			content: "''",
			height: '8px',
			width: '100%',
			marginTop: '1px',
			position: 'absolute',
			zIndex: '0'
		},
		'&::after': {
			content: "'AUDIO PLAYER'",
			position: 'absolute',
			marginTop: '-5px',
			textAlign: 'center',
			paddingLeft: '10px',
			paddingRight: '10px',
			zIndex: '1',
			left: '50%',
			transform: 'translate(-50%)',
			backgroundColor: '#353551'
		}
	}
})

export const TransportButton = style({
	display: 'inline-flex',
	justifyContent: 'center',
	alignItems: 'center',
	border: '0',
	padding: '0px',
	color: '#bfced9',
	backgroundColor: 'transparent',
	fontSize: '1.5em',
	backgroundSize: 'cover',
	backgroundRepeat: 'no-repeat',
	width: '23px',
	height: '18px',
	marginTop: '3px',
	selectors: {
		'&:hover:enabled': {
			filter: 'brightness(0.8)'
		},
		'&:disabled': {
			filter: 'opacity(0.2)'
		},
		'&.left': {
			backgroundImage:
				"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAAAAXNSR0IArs4c6QAAAR9JREFUOE9jXLflyH8GKoNb9+8zLJg2nYERZLirtzXVjN+99SjDqvXrGC4cPYEw/Ny5axRb8Pb5ewaQq08cP85w8/zFATK8v3cq3CeFxdkYvoLJI8uBXH7+/DmGy9dvMNw4dwG3y0GavX18GSIiPRjQgwyXHLLheIMFlwEwcZBX0C2myHBkgwkZfuvCJeKDBd1gQoaTFCxGRloMK5bvQIlYfMFCkstBpqJbQFXD0S2guuHIFpBtOCgIYABb0QCTR5ZDToooYQ4qcKgBYDkUbjjIUFCB8/XDe2qYD87+ty5cZmDsmLz4/4UL5xl+fP9BFYNhhoANV1Ex+c/IwIgwmBHCZmJkYADVImAeIyMDI1QcopARLMbwH6ICWQ7ChpgBALmEbxNdP+hCAAAAAElFTkSuQmCC')"
		},
		'&.right': {
			backgroundImage:
				"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAAAAXNSR0IArs4c6QAAAPpJREFUOE9jXLflyH8GKoNb9+8zqCkqMjCCDHf1tqaa8bu3HmVYtX4dQ1hgEMLwc+euUWzB2+fvGUCuPnH8OENcVNQAGd7fOxXsk8LibAwfweTQ5UEuP3/+HMPl6zfwuxxkgLePL8PWLZsxLIDJRUR6MCAHJ8mGg1yHbgFVDUe3gOqGI1tAE8NhYUx1w5Ejj6qGo6cKqhmObjAo7Ck23MhIC5x5sBULMDl0eZzpHFTgUANg5FCQoaAC5+uH99QwH5z9Xz98z8DYMXnx/wsXzjP8+P6DKgbDDDm4fS0Do6VlKLiyYGRkYvj//z8DIyMjDkuwi+NSfu3afgYAwOpci2zN3WMAAAAASUVORK5CYII=')"
		},
		'&.play': {
			backgroundImage:
				"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAAAAXNSR0IArs4c6QAAAQ9JREFUOE/FlbESwUAQhnfzLswo6YxOoTBDyzsoeQQlHaWSjoKhVJ4uoRGqoFFKR3dmw0oGiRM345rM3F2+/78/uxccToUEzcN2HBh0e4AEzxez2vDz2QL6oyFshOXDTcv+WcA9ukCuhRBwWG3+BG+3ut5J6o2a8onIuWmZYK1t2C0jnBO8VC7DZDxWFgnCI2NhONtWEfna+XMmUSKxnauIaINXKwVPL1jCQfh+tQ0vxefM2fk7KK/Fdh4FfQ9XcK4C/RqeSadeMv3UTaGZ04WjY3CHPj4oQenCObsnHXyv/Q9ULc1OX5La5XzRAmaI5zyZyEkABDTQhyMC8i8Eb/PIT+B9/n7j/q6ktfs0SgOutQw52vzOQLoAAAAASUVORK5CYII=')"
		},
		'&.pause': {
			backgroundImage:
				"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAAAAXNSR0IArs4c6QAAAPZJREFUOE9jXLv12H8GKoPr9+8zrJmzjIERZLiTlyXVjN+37TjD0nVrGe6duYkw/Nz56xRb8OH5BwaQq48dO8bw/PqjATC8t2cqii+KS7LhfHxyIJefO3+O4fy16wzPrj7E7nKQAb5+fmADI8LdGJCDDJ8csuE4g2VkGz4a5vBkSr/UcgNHDjUy1ETJRMjpHJ8cTpeDChxqAFgOfX79MSSHggwFFTjfP7ynhvng7A/OoS1Tlv4H2fbj+w+qGAwz5AXI5To6rv8ZGBgZGBkZEYYzMjIwwqoQEJuRkeH///9gGgRh4D8jAwMjiGBgYGBkQoiD1IC0AwDEdnVTCfcsTgAAAABJRU5ErkJggg==')"
		}
	}
})

export const ToggleButton = style({
	fontFamily: 'monospace',
	color: theme.color.text,
	fontSize: '12px',
	fontWeight: 'bold',
	marginLeft: '5px',
	marginRight: '5px',
	cursor: 'pointer',
	selectors: {
		'&:active,&:hover,&.active': {
			textShadow: '0px 0px 6px #00ff0f',
			color: '#20ff17'
		}
	}
})

export const LengthWrapper = style({
	lineHeight: '1em',
	color: '#28da1d',
	pointerEvents: 'none',
	zIndex: '11',
	position: 'absolute',
	top: '50%',
	transform: 'translateY(-50%)',
	fontFamily: 'monospace',
	backgroundColor: 'black'
})

export const TracklistWrapper = style({
	overflowY: 'auto',
	maxHeight: '90vh',
	backgroundColor: 'black',
	margin: '5px',
	border: theme.borders.groove,
	paddingLeft: '0px',
	paddingRight: '0px'
})

export const TracklistTrack = style({
	lineHeight: '1.5rem',
	paddingLeft: '3px',
	paddingRight: '3px',
	listStyle: 'none',
	textAlign: 'left',
	fontFamily: 'monospace',
	color: '#28da1d',
	display: 'flex',
	flexDirection: 'column',
	'@media': {
		'screen and (--xs)': {
			flexDirection: 'row'
		}
	},
	selectors: {
		'&.active': {
			backgroundColor: '#0818c4'
		}
	}
})

globalStyle(`${TracklistTrack} a`, {
	color: '#28da1d'
})

globalStyle(`${TracklistTrack} a:hover`, {
	color: theme.color.lightContrast2
})

globalStyle("div[part='region-content']", {
	color: 'rgb(8, 24, 196)'
})
