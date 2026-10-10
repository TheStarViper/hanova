import { Pos } from "./utils.svelte";

// svg imports
import Island1Svg from "#lib/assets/island1.svg?raw";
import Island2Svg from "#lib/assets/island2.svg?raw";
import Island3Svg from "#lib/assets/island3.svg?raw";
import Island4Svg from "#lib/assets/island4.svg?raw";
import Island5Svg from "#lib/assets/island5.svg?raw";
import Island6Svg from "#lib/assets/island6.svg?raw";
import type { FileFormat, FormatName } from "./fileManager";

export interface IslandSprite {
	svg: string;
	width: number;
	treasureOffset: Pos;
	spawnOffset: Pos;
	radius: number;
}

export const ISLAND_SPRITES = {
	// used for bmp
	1: {
		svg: Island1Svg,
		width: 255,
		treasureOffset: new Pos(40, -10),
		spawnOffset: new Pos(-80, 80),
		radius: 152,
	},
	// used for svg
	2: {
		svg: Island2Svg,
		width: 232,
		treasureOffset: new Pos(10, 30),
		spawnOffset: new Pos(190, 60),
		radius: 135,
	},
	// used for png
	3: {
		svg: Island3Svg,
		width: 336,
		treasureOffset: new Pos(120, -70),
		spawnOffset: new Pos(220, -50),
		radius: 205,
	},
	// used for webp
	4: {
		svg: Island4Svg,
		width: 243,
		treasureOffset: new Pos(-5, 45),
		spawnOffset: new Pos(-120, 120),
		radius: 140,
	},
	// used for jpeg
	5: {
		svg: Island5Svg,
		width: 305,
		treasureOffset: new Pos(110, 0),
		spawnOffset: new Pos(100, 150),
		radius: 175,
	},
	6: {
		svg: Island6Svg,
		width: 98,
		treasureOffset: new Pos(0, 0),
		spawnOffset: new Pos(0, 0),
		radius: 0,
	},
} as const satisfies Record<number, IslandSprite>;

type IslandSpriteIndex = keyof typeof ISLAND_SPRITES;

export interface IslandDatum {
	name: FormatName;
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
		pos: new Pos(630, 100),
		islandSpriteIndex: 5,
	},
	{
		name: "PNG",
		pos: new Pos(220, 600),
		islandSpriteIndex: 3,
	},
	{
		name: "WebP",
		pos: new Pos(1050, 150),
		islandSpriteIndex: 4,
	},
	{
		name: "SVG",
		pos: new Pos(400, -200),
		islandSpriteIndex: 2,
	},
] as const satisfies IslandDatum[];

export class Island {
	callBoat: () => void;
	name: FormatName;
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

	static findSpawnOffsetForFormat(formatName: FormatName): Pos | undefined {
		const islandDatum = ISLAND_DATA.find(
			(datum) => datum.name.toLowerCase() === formatName.toLowerCase(),
		);
		if (islandDatum === undefined) return undefined;

		const islandSprite = ISLAND_SPRITES[islandDatum.islandSpriteIndex];

		return Pos.add(islandDatum.pos, islandSprite.spawnOffset);
	}
}
