import { Ellipse, Pos } from "./utils.svelte";

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

import type { Format } from "./fileManager";

export interface IslandSprite {
  svg: string;
  width: number;
  treasureOffset: Pos;
  bound: Ellipse;
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
    bound: new Ellipse(5, -10, 55, 65, 10),
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
    bound: new Ellipse(0, -20, 85, 70, 0),
  },
  9: {
    svg: Island9Svg,
    width: 300,
    treasureOffset: new Pos(35, -80),
    bound: new Ellipse(0, -20, 150, 125, -15),
  },
  10: {
    svg: Island10Svg,
    width: 244,
    treasureOffset: new Pos(0, 0),
    bound: new Ellipse(0, 0, 195, 195, 0),
  },
  11: {
    svg: Island11Svg,
    width: 251,
    treasureOffset: new Pos(-30, 90),
    bound: new Ellipse(0, -20, 135, 170, 0),
  },
  12: {
    svg: Island12Svg,
    width: 242,
    treasureOffset: new Pos(30, 70),
    bound: new Ellipse(0, 0, 115, 130, -20),
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
    bound: new Ellipse(10, -15, 160, 150, 0),
  },
  15: {
    svg: Island15Svg,
    width: 293,
    treasureOffset: new Pos(3, 30),
    bound: new Ellipse(10, -30, 160, 130, 20),
  },
  16: {
    svg: Island16Svg,
    width: 382,
    treasureOffset: new Pos(100, 20),
    bound: new Ellipse(30, -30, 185, 230, 120),
  },
  17: {
    svg: Island17Svg,
    width: 432,
    treasureOffset: new Pos(180, 50),
    bound: new Ellipse(10, -10, 180, 240, -70),
  },
  18: {
    svg: Island18Svg,
    width: 207,
    treasureOffset: new Pos(-40, 0),
    bound: new Ellipse(5, -10, 120, 100, 0),
  },
  19: {
    svg: Island19Svg,
    width: 249,
    treasureOffset: new Pos(-40, 90),
    bound: new Ellipse(-10, -5, 130, 185, -15),
  },
} as const satisfies Record<number, IslandSprite>;

type IslandSpriteIndex = keyof typeof ISLAND_SPRITES;

export interface IslandDatum {
  name: Format;
  pos: Pos;
  islandSpriteIndex: IslandSpriteIndex;
  spawnOffset: Pos;
}

export const ISLAND_DATA = [
  {
    name: "bmp",
    pos: new Pos(0, 500),
    islandSpriteIndex: 18,
    spawnOffset: new Pos(0, -160),
  },
  {
    name: "gif",
    pos: new Pos(0, 800),
    islandSpriteIndex: 6,
    spawnOffset: new Pos(50, 100),
  },
  {
    name: "jpg",
    pos: new Pos(400, 550),
    islandSpriteIndex: 16,
    spawnOffset: new Pos(200, 20),
  },
  {
    name: "jxl",
    pos: new Pos(600, 880),
    islandSpriteIndex: 8,
    spawnOffset: new Pos(-100, 100),
  },
  {
    name: "png",
    pos: new Pos(200, 100),
    islandSpriteIndex: 17,
    spawnOffset: new Pos(250, -100),
  },
  {
    name: "webp",
    pos: new Pos(850, 240),
    islandSpriteIndex: 15,
    spawnOffset: new Pos(160, -120),
  },
  {
    name: "avif",
    pos: new Pos(1300, -200),
    islandSpriteIndex: 14,
    spawnOffset: new Pos(-130, 100),
  },
  // {
  //   name: "heic",
  //   pos: new Pos(1150, 350),
  //   islandSpriteIndex: 12,
  //   spawnOffset: new Pos(180, 50),
  // },
  {
    name: "tiff",
    pos: new Pos(900, -150),
    islandSpriteIndex: 19,
    spawnOffset: new Pos(90, 170),
  },
  {
    name: "eps",
    pos: new Pos(1500, 150),
    islandSpriteIndex: 11,
    spawnOffset: new Pos(-40, 200),
  },
  {
    name: "exr",
    pos: new Pos(1050, -500),
    islandSpriteIndex: 15,
    spawnOffset: new Pos(-200, 0),
  },
  {
    name: "tga",
    pos: new Pos(1370, 570),
    islandSpriteIndex: 18,
    spawnOffset: new Pos(0, -150),
  },
  {
    name: "hdr",
    pos: new Pos(1650, 510),
    islandSpriteIndex: 14,
    spawnOffset: new Pos(-170, -80),
  },
  {
    name: "svg",
    pos: new Pos(300, -250),
    islandSpriteIndex: 8,
    spawnOffset: new Pos(100, 100),
  },
  {
    name: "ico",
    pos: new Pos(550, -350),
    islandSpriteIndex: 18,
    spawnOffset: new Pos(150, 0),
  },
  {
    name: "psd",
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
  // {
  //   name: "PDF",
  //   pos: new Pos(1050, 670),
  //   islandSpriteIndex: 18,
  //   spawnOffset: new Pos(160, 20),
  // },
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

  isInside(point: Pos): boolean {
    return this.sprite.bound.isInside(Pos.sub(point, this.pos));
  }

  static findSpawnOffsetForFormat(formatName: Format): Pos | undefined {
    const islandDatum = ISLAND_DATA.find(
      (datum) => datum.name.toLowerCase() === formatName.toLowerCase(),
    );
    if (islandDatum === undefined) return undefined;

    return Pos.add(islandDatum.pos, islandDatum.spawnOffset);
  }
}
