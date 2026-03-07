import { style } from "@vanilla-extract/css";

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
	width: '28px',
	height: '23px',
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
