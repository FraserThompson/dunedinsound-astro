import { style } from "@vanilla-extract/css";
import { theme } from "src/Theme.css";

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
	selectors: {
		'&:hover:enabled': {
			filter: 'brightness(0.8)'
		},
		'&:disabled': {
			filter: 'opacity(0.2)'
		},
		'&.left': {
			backgroundImage:
				"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAAAAXNSR0IArs4c6QAAAR9JREFUOE9jXLflyH8GKoNb9+8zLJg2nYERZLirtzXVjN+99SjDqvXrGC4cPYEw/Ny5axRb8Pb5ewaQq08cP85w8/zFATK8v3cq3CeFxdkYvoLJI8uBXH7+/DmGy9dvMNw4dwG3y0GavX18GSIiPRjQgwyXHLLheIMFlwEwcZBX0C2myHBkgwkZfuvCJeKDBd1gQoaTFCxGRloMK5bvQIlYfMFCkstBpqJbQFXD0S2guuHIFpBtOCgIYABb0QCTR5ZDToooYQ4qcKgBYDkUbjjIUFCB8/XDe2qYD87+ty5cZmDsmLz4/4UL5xl+fP9BFYNhhoANV1Ex+c/IwIgwmBHCZmJkYADVImAeIyMDI1QcopARLMbwH6ICWQ7ChpgBALmEbxNdP+hCAAAAAElFTkSuQmCC')",
			width: '28px',
			height: '23px',
		},
		'&.right': {
			backgroundImage:
				"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAAAAXNSR0IArs4c6QAAAPpJREFUOE9jXLflyH8GKoNb9+8zqCkqMjCCDHf1tqaa8bu3HmVYtX4dQ1hgEMLwc+euUWzB2+fvGUCuPnH8OENcVNQAGd7fOxXsk8LibAwfweTQ5UEuP3/+HMPl6zfwuxxkgLePL8PWLZsxLIDJRUR6MCAHJ8mGg1yHbgFVDUe3gOqGI1tAE8NhYUx1w5Ejj6qGo6cKqhmObjAo7Ck23MhIC5x5sBULMDl0eZzpHFTgUANg5FCQoaAC5+uH99QwH5z9Xz98z8DYMXnx/wsXzjP8+P6DKgbDDDm4fS0Do6VlKLiyYGRkYvj//z8DIyMjDkuwi+NSfu3afgYAwOpci2zN3WMAAAAASUVORK5CYII=')",
			width: '28px',
			height: '23px',
		},
		'&.play': {
			backgroundImage:
				"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAAAAXNSR0IArs4c6QAAAQ9JREFUOE/FlbESwUAQhnfzLswo6YxOoTBDyzsoeQQlHaWSjoKhVJ4uoRGqoFFKR3dmw0oGiRM345rM3F2+/78/uxccToUEzcN2HBh0e4AEzxez2vDz2QL6oyFshOXDTcv+WcA9ukCuhRBwWG3+BG+3ut5J6o2a8onIuWmZYK1t2C0jnBO8VC7DZDxWFgnCI2NhONtWEfna+XMmUSKxnauIaINXKwVPL1jCQfh+tQ0vxefM2fk7KK/Fdh4FfQ9XcK4C/RqeSadeMv3UTaGZ04WjY3CHPj4oQenCObsnHXyv/Q9ULc1OX5La5XzRAmaI5zyZyEkABDTQhyMC8i8Eb/PIT+B9/n7j/q6ktfs0SgOutQw52vzOQLoAAAAASUVORK5CYII=')",
			width: '28px',
			height: '23px',
		},
		'&.pause': {
			backgroundImage:
				"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAASCAYAAACw50UTAAAAAXNSR0IArs4c6QAAAPZJREFUOE9jXLv12H8GKoPr9+8zrJmzjIERZLiTlyXVjN+37TjD0nVrGe6duYkw/Nz56xRb8OH5BwaQq48dO8bw/PqjATC8t2cqii+KS7LhfHxyIJefO3+O4fy16wzPrj7E7nKQAb5+fmADI8LdGJCDDJ8csuE4g2VkGz4a5vBkSr/UcgNHDjUy1ETJRMjpHJ8cTpeDChxqAFgOfX79MSSHggwFFTjfP7ynhvng7A/OoS1Tlv4H2fbj+w+qGAwz5AXI5To6rv8ZGBgZGBkZEYYzMjIwwqoQEJuRkeH///9gGgRh4D8jAwMjiGBgYGBkQoiD1IC0AwDEdnVTCfcsTgAAAABJRU5ErkJggg==')",
			width: '28px',
			height: '23px',
		},
		'&.shuffle': {
			backgroundImage:
				"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAPCAMAAABDVWaoAAAAilBMVEUQWgAqKUIqKkEqKkMrK0QsK0MsK0QsLEUsLEYtLUcuLUcuLUguLkkvL0ovN00wL0swL0wwMEsxMU0xMU4yMU4yMk8zM1A0M1E0M1I0NFE0NFM1NVQ1NlQ2NVM2NlU2NlY3N1c3N1g3OFc4N1g4OFk5OVpKWmtSY3N7hJSElKWttca9ztbV3vLv///LbncEAAAAqklEQVQoz5WSsQ7CMBBD37WpGPgDpJtY+/8fAxLLfUbVM0OiNgKG4CGKL45jRbYbiSUIkBAiMZJEqI2EMjGYynVhHHoWmIfle1IEOeqeogCwAQwFq3oesIoADyfaAt4mBHivb/Av5h8nRQCslQVOHPrK/Nif/ouaSdDd+OlvXYDD2qOP1r9j98s8/p/5KlarMIoCu/SPXvmf/yb2SQJkotZD087Z2VrcBIM3KB9V4lGQbMMAAAAASUVORK5CYII=)",
			marginLeft: '5px',
			marginBottom: '3px',
			width: '80px',
			height: '23px',
		},
		'&.shuffle.selected': {
			backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAPCAMAAABDVWaoAAAAilBMVEUA1gAqKUIqKkEqKkMrK0QsK0MsK0QsLEUsLEYtLUcuLUcuLUguLkkvL0ovN00wL0swL0wwMEsxMU0xMU4yMU4yMk8zM1A0M1E0M1I0NFE0NFM1NVQ1NlQ2NVM2NlU2NlY3N1c3N1g3OFc4N1g4OFk5OVpKWmtSY3N7hJSElKWttca9ztbV3vLv//8gEwg9AAAAqklEQVQoz5WSsQ7CMBBD37WpGPgDpJtY+/8fAxLLfUbVM0OiNgKG4CGKL45jRbYbiSUIkBAiMZJEqI2EMjGYynVhHHoWmIfle1IEOeqeogCwAQwFq3oesIoADyfaAt4mBHivb/Av5h8nRQCslQVOHPrK/Nif/ouaSdDd+OlvXYDD2qOP1r9j98s8/p/5KlarMIoCu/SPXvmf/yb2SQJkotZD087Z2VrcBIM3KB9V4lGQbMMAAAAASUVORK5CYII=)",
		}
	}
})
