/**
 * Transport + current track info but small.
 */

import type { FunctionalComponent } from "preact"
import { compactPlayerControls } from "@src/components/GlobalPlayerContainer.css"
import PlayerCurrentStatus from "./PlayerCurrentStatus"
import PlayerCurrentTrack from "./PlayerCurrentTrack"
import PlayerTransport from "./PlayerTransport"

const CompactPlayerControls: FunctionalComponent = () => {
	return (
		<div className={compactPlayerControls}>
			<PlayerTransport />
			<PlayerCurrentStatus />
			<PlayerCurrentTrack />
		</div>
	)
}

export default CompactPlayerControls
