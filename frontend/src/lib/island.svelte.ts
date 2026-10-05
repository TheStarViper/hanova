import { Pos } from "./utils.svelte";

// svg imports
import Island1Svg from "#lib/assets/island1.svg?raw";
import Island2Svg from "#lib/assets/island2.svg?raw";
import Island3Svg from "#lib/assets/island3.svg?raw";
import Island4Svg from "#lib/assets/island4.svg?raw";
import Island5Svg from "#lib/assets/island5.svg?raw";
import Island6Svg from "#lib/assets/island6.svg?raw";

export interface IslandSprite {
	svg: string;
	width: number;
	treasureOffset: Pos;
	radius: number;
}

export const ISLAND_SPRITES = {
	1: {
		svg: Island1Svg,
		width: 255,
		treasureOffset: new Pos(40, -10),
		radius: 152,
	},
	2: {
		svg: Island2Svg,
		width: 232,
		treasureOffset: new Pos(10, 30),
		radius: 135,
	},
	3: {
		svg: Island3Svg,
		width: 336,
		treasureOffset: new Pos(120, -70),
		radius: 205,
	},
	4: {
		svg: Island4Svg,
		width: 243,
		treasureOffset: new Pos(-5, 45),
		radius: 140,
	},
	5: {
		svg: Island5Svg,
		width: 305,
		treasureOffset: new Pos(0, 0),
		radius: 0,
	},
	6: {
		svg: Island6Svg,
		width: 98,
		treasureOffset: new Pos(0, 0),
		radius: 0,
	},
} as const satisfies Record<number, IslandSprite>;

type IslandSpriteIndex = keyof typeof ISLAND_SPRITES;

export interface IslandDatum {
	name: string;
	pos: Pos;
	islandSpriteIndex: IslandSpriteIndex;
}

export const ISLAND_DATA = [
	{
		name: "BMP",
		pos: new Pos(200, 200),
		islandSpriteIndex: 1,
	},
	{
		name: "JPEG",
		pos: new Pos(600, 200),
		islandSpriteIndex: 2,
	},
	{
		name: "PNG",
		pos: new Pos(220, 600),
		islandSpriteIndex: 3,
	},
	{
		name: "WebP",
		pos: new Pos(950, 150),
		islandSpriteIndex: 4,
	},
] as const satisfies IslandDatum[];

export class Island {
	callBoat: () => void;
	name: string;
	pos: Pos;
	sprite: IslandSprite;

	constructor(
		datum: IslandDatum,
		islandClickHandler: (me: Island, endPos: Pos) => void,
	) {
		this.name = datum.name;
		this.pos = datum.pos;
		this.sprite = ISLAND_SPRITES[datum.islandSpriteIndex];

		this.callBoat = () => islandClickHandler(this, this.treasurePos);
	}

	get treasurePos() {
		return Pos.add(this.pos, this.sprite.treasureOffset);
	}
}
