import { Pos } from "./utils.svelte";

export class Island {
	callBoat: () => void;

	constructor(
		public pos: Pos,
		sailBoat: (endPos: Pos) => void,
	) {
		this.callBoat = () => sailBoat(this.pos);
	}
}
