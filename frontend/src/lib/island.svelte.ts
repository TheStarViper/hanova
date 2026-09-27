import { Pos } from "./utils.svelte";

export class Island {
	callBoat: () => void;
	treasureOffset = new Pos();

	constructor(
		public pos: Pos,
		sailBoat: (me: Island, endPos: Pos) => void,
	) {
		this.callBoat = () => {
			sailBoat(this, this.pos);
		};
	}
}
