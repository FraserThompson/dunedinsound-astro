/**
 * Pleasant clouds drifting slowly by.
 */

import { cloud1, cloud2, cloud3, cloud4, cloud5, CloudsWrapper } from "./CloudBackground.css";

export default () => (
	<div className={`${CloudsWrapper}`}>
		<div className={`${cloud1}`}></div>
		<div className={`${cloud2}`}></div>
		<div className={`${cloud3}`}></div>
		<div className={`${cloud4}`}></div>
		<div className={`${cloud5}`}></div>
	</div>
)
