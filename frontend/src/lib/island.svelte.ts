import { Pos } from "./utils.svelte";

// svg imports
import Island1Svg from "#lib/assets/island1.svg?raw";
import Island10Svg from "#lib/assets/island10.svg?raw";
import Island11Svg from "#lib/assets/island11.svg?raw";
import Island12Svg from "#lib/assets/island12.svg?raw";
import Island13Svg from "#lib/assets/island13.svg?raw";
import Island14Svg from "#lib/assets/island14.svg?raw";
import Island15Svg from "#lib/assets/island15.svg?raw";
import Island16Svg from "#lib/assets/island16.svg?raw";
import Island17Svg from "#lib/assets/island17.svg?raw";
import Island18Svg from "#lib/assets/island18.svg?raw";
import Island19Svg from "#lib/assets/island19.svg?raw";
import Island2Svg from "#lib/assets/island2.svg?raw";
import Island3Svg from "#lib/assets/island3.svg?raw";
import Island4Svg from "#lib/assets/island4.svg?raw";
import Island5Svg from "#lib/assets/island5.svg?raw";
import Island6Svg from "#lib/assets/island6.svg?raw";
import Island7Svg from "#lib/assets/island7.svg?raw";
import Island8Svg from "#lib/assets/island8.svg?raw";
import Island9Svg from "#lib/assets/island9.svg?raw";

import type { FormatName } from "./fileManager";

export interface IslandSprite {
  svg: string;
  width: number;
  treasureOffset: Pos;
  radius: number;
}

export const ISLAND_SPRITES = {
  /**
	 * these are all broken
  1: {
    svg: Island1Svg,
    width: 255,
    treasureOffset: new Pos(40, -10),
    spawnOffset: new Pos(-80, 80),
    radius: 152,
  },
  2: {
    svg: Island2Svg,
    width: 232,
    treasureOffset: new Pos(10, 30),
    spawnOffset: new Pos(190, 60),
    radius: 135,
  },
  3: {
    svg: Island3Svg,
    width: 336,
    treasureOffset: new Pos(120, -70),
    spawnOffset: new Pos(220, -50),
    radius: 200,
  },
  4: {
    svg: Island4Svg,
    width: 243,
    treasureOffset: new Pos(-5, 45),
    spawnOffset: new Pos(-120, 120),
    radius: 140,
  },
  5: {
    svg: Island5Svg,
    width: 305,
    treasureOffset: new Pos(110, 0),
    spawnOffset: new Pos(100, 150),
    radius: 175,
  },
   */

  6: {
    svg: Island6Svg,
    width: 98,
    treasureOffset: new Pos(20, 0),
    radius: 65,
  },

  // too big
  // 7: {
  //   svg: Island7Svg,
  //   width: 605,
  //   treasureOffset: new Pos(0, 0),
  //   radius: 320,
  // },
  8: {
    svg: Island8Svg,
    width: 156,
    treasureOffset: new Pos(10, -10),
    radius: 90,
  },
  9: {
    svg: Island9Svg,
    width: 300,
    treasureOffset: new Pos(35, -80),
    radius: 150,
  },
  10: {
    svg: Island10Svg,
    width: 244,
    treasureOffset: new Pos(0, 0),
    radius: 195,
  },
  11: {
    svg: Island11Svg,
    width: 251,
    treasureOffset: new Pos(-30, 90),
    radius: 200,
  },
  12: {
    svg: Island12Svg,
    width: 242,
    treasureOffset: new Pos(30, 70),
    radius: 130,
  },
  // too big
  // 13: {
  //   svg: Island13Svg,
  //   width: 458,
  //   treasureOffset: new Pos(0, 0),
  //   radius: 250,
  // },
  14: {
    svg: Island14Svg,
    width: 295,
    treasureOffset: new Pos(-100, -20),
    radius: 175,
  },
  15: {
    svg: Island15Svg,
    width: 293,
    treasureOffset: new Pos(3, 30),
    radius: 160,
  },
  16: {
    svg: Island16Svg,
    width: 382,
    treasureOffset: new Pos(100, 20),
    radius: 230,
  },
  17: {
    svg: Island17Svg,
    width: 432,
    treasureOffset: new Pos(180, 50),
    radius: 230,
  },
  18: {
    svg: Island18Svg,
    width: 207,
    treasureOffset: new Pos(-40, 0),
    radius: 110,
  },
  19: {
    svg: Island19Svg,
    width: 249,
    treasureOffset: new Pos(-40, 90),
    radius: 185,
  },
} as const satisfies Record<number, IslandSprite>;

type IslandSpriteIndex = keyof typeof ISLAND_SPRITES;

export interface IslandDatum {
  name: FormatName;
  pos: Pos;
  islandSpriteIndex: IslandSpriteIndex;
  spawnOffset: Pos;
}

export const ISLAND_DATA = [
  {
    name: "BMP",
    pos: new Pos(0, 500),
    islandSpriteIndex: 18,
    spawnOffset: new Pos(0, -160),
  },
  {
    name: "GIF",
    pos: new Pos(0, 800),
    islandSpriteIndex: 6,
    spawnOffset: new Pos(50, 100),
  },
  {
    name: "JPEG",
    pos: new Pos(400, 550),
    islandSpriteIndex: 16,
    spawnOffset: new Pos(200, 20),
  },
  {
    name: "JPEGXL",
    pos: new Pos(600, 880),
    islandSpriteIndex: 8,
    spawnOffset: new Pos(-100, 100),
  },
  {
    name: "PNG",
    pos: new Pos(200, 100),
    islandSpriteIndex: 17,
    spawnOffset: new Pos(250, -100),
  },
  {
    name: "WebP",
    pos: new Pos(850, 240),
    islandSpriteIndex: 15,
    spawnOffset: new Pos(160, -120),
  },
  {
    name: "AVIF",
    pos: new Pos(1300, -200),
    islandSpriteIndex: 14,
    spawnOffset: new Pos(-130, 100),
  },
  {
    name: "HEIF",
    pos: new Pos(1150, 350),
    islandSpriteIndex: 12,
    spawnOffset: new Pos(180, 50),
  },
  {
    name: "TIFF",
    pos: new Pos(900, -150),
    islandSpriteIndex: 19,
    spawnOffset: new Pos(90, 170),
  },
  {
    name: "EPS",
    pos: new Pos(1500, 150),
    islandSpriteIndex: 11,
    spawnOffset: new Pos(-40, 200),
  },
  {
    name: "EXR",
    pos: new Pos(1050, -500),
    islandSpriteIndex: 15,
    spawnOffset: new Pos(-200, 0),
  },
  {
    name: "TGA",
    pos: new Pos(1370, 570),
    islandSpriteIndex: 18,
    spawnOffset: new Pos(0, -150),
  },
  {
    name: "HDR",
    pos: new Pos(1650, 510),
    islandSpriteIndex: 14,
    spawnOffset: new Pos(-170, -80),
  },
  {
    name: "SVG",
    pos: new Pos(300, -250),
    islandSpriteIndex: 8,
    spawnOffset: new Pos(100, 100),
  },
  {
    name: "ICO",
    pos: new Pos(550, -350),
    islandSpriteIndex: 18,
    spawnOffset: new Pos(150, 0),
  },
  {
    name: "PSD",
    pos: new Pos(1000, 1000),
    islandSpriteIndex: 9,
    spawnOffset: new Pos(-200, 30),
  },
  // {
  //   name: "ORA",
  //   pos: new Pos(900, 1200),
  //   islandSpriteIndex: 1,
  //   spawnOffset: new Pos(0, 0),
  // },
  // {
  //   name: "XCF",
  //   pos: new Pos(1300, 1050),
  //   islandSpriteIndex: 1,
  //   spawnOffset: new Pos(0, 0),
  // },
  {
    name: "PDF",
    pos: new Pos(1050, 670),
    islandSpriteIndex: 18,
    spawnOffset: new Pos(160, 20),
  },
] as const satisfies IslandDatum[];

export class Island {
  callBoat: () => void;

  constructor(
    public datum: IslandDatum,
    islandClickHandler: (targetIsland: Island) => void,
  ) {
    this.callBoat = () => islandClickHandler(this);
  }

  get name() {
    return this.datum.name;
  }

  get pos() {
    return this.datum.pos;
  }

  get sprite() {
    return ISLAND_SPRITES[this.datum.islandSpriteIndex];
  }

  get spawnOffset() {
    return this.datum.spawnOffset;
  }

  get treasurePos() {
    return Pos.add(this.pos, this.sprite.treasureOffset);
  }

  static findSpawnOffsetForFormat(formatName: FormatName): Pos | undefined {
    const islandDatum = ISLAND_DATA.find(
      (datum) => datum.name.toLowerCase() === formatName.toLowerCase(),
    );
    if (islandDatum === undefined) return undefined;

    return Pos.add(islandDatum.pos, islandDatum.spawnOffset);
  }
}
