import { Pos } from "./utils.svelte";

export class Island {
	public callBoat: () => void;

	public constructor(
		public pos: Pos,
		sailBoat: (endPos: Pos) => void,
	) {
		this.callBoat = () => sailBoat(this.pos);
	}
}
