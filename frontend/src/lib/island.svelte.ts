import { Pos } from "./utils.svelte";

// svg imports
import Island1Svg from "$lib/assets/island1.svg?raw";
import Island2Svg from "$lib/assets/island2.svg?raw";
import Island3Svg from "$lib/assets/island3.svg?raw";
import Island4Svg from "$lib/assets/island4.svg?raw";
import Island5Svg from "$lib/assets/island5.svg?raw";
import Island6Svg from "$lib/assets/island6.svg?raw";

export const SVG_MAPPING: Record<number, string> = {
	1: Island1Svg,
	2: Island2Svg,
	3: Island3Svg,
	4: Island4Svg,
	5: Island5Svg,
	6: Island6Svg,
};

export const WIDTH_MAPPING: Record<number, number> = {
	1: 255,
	2: 232,
	3: 336,
	4: 243,
	5: 305,
	6: 98,
};

export const TREASURE_OFFSET_MAPPING: Record<number, Pos> = {
	1: new Pos(40, -10),
	2: new Pos(10, 30),
	3: new Pos(120, -70),
	4: new Pos(0, 0),
	5: new Pos(0, 0),
	6: new Pos(0, 0),
};

export class Island {
	callBoat: () => void;

	public treasureOffset: Pos;

	constructor(
		public name: string,
		public pos: Pos,
		public islandSpriteIndex: number,
		islandClickHandler: (me: Island, endPos: Pos) => void,
	) {
		this.callBoat = () => {
			islandClickHandler(this, this.treasurePos);
		};

		this.treasureOffset = TREASURE_OFFSET_MAPPING[islandSpriteIndex];
	}

	get treasurePos() {
		return new Pos(
			this.pos.x + this.treasureOffset.x,
			this.pos.y + this.treasureOffset.y,
		);
	}
}
