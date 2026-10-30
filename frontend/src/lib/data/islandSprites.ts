import { Ellipse, Pos } from "#lib/utils.svelte.js";

// svg imports
import Island1Svg from "#lib/assets/island1.svg";
import Island10Svg from "#lib/assets/island10.svg";
import Island11Svg from "#lib/assets/island11.svg";
import Island12Svg from "#lib/assets/island12.svg";
import Island13Svg from "#lib/assets/island13.svg";
import Island14Svg from "#lib/assets/island14.svg";
import Island15Svg from "#lib/assets/island15.svg";
import Island16Svg from "#lib/assets/island16.svg";
import Island17Svg from "#lib/assets/island17.svg";
import Island18Svg from "#lib/assets/island18.svg";
import Island19Svg from "#lib/assets/island19.svg";
import Island2Svg from "#lib/assets/island2.svg";
import Island3Svg from "#lib/assets/island3.svg";
import Island4Svg from "#lib/assets/island4.svg";
import Island5Svg from "#lib/assets/island5.svg";
import Island6Svg from "#lib/assets/island6.svg";
import Island7Svg from "#lib/assets/island7.svg";
import Island8Svg from "#lib/assets/island8.svg";
import Island9Svg from "#lib/assets/island9.svg";

export interface IslandSprite {
  svg: string;
  width: number;
  treasureOffset: Pos;
  bound: Ellipse;
}

export type IslandSpriteIndex = keyof typeof ISLAND_SPRITES;

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
