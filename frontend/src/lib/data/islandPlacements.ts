import { type Format, FORMATS, type MediaType } from "#lib/backend.js";
import { Pos } from "#lib/utils.svelte.js";
import IslandData from "./islandData.json";
import { ISLAND_SPRITES, type IslandSpriteIndex } from "./islandSprites";

export interface IslandDatum {
  x: number;
  y: number;
  islandSpriteIndex: IslandSpriteIndex;
  spawnOffsetX: number;
  spawnOffsetY: number;
}

export const ISLAND_CLUSTER_CENTERS: Record<MediaType, Pos> = {
  image: new Pos(0, 0),
  audio: new Pos(2000, -2000),
  video: new Pos(3500, -500),
  document: new Pos(-2000, -2000),
  model: new Pos(-2400, 800),
};

export const ISLAND_DATA = IslandData as Partial<Record<Format, IslandDatum>>;

// function randomlyInitUnusedIslands() {
//   const spriteKeys = Object.keys(ISLAND_SPRITES);
//   const randomSprite = () =>
//     spriteKeys[Math.floor(Math.random() * spriteKeys.length)];

//   const randomPos = () => Math.round((Math.random() * 2000) - 1000);

//   return FORMATS
//     .filter((f) => !(f in ISLAND_DATA))
//     .map((f) =>
//       `${f}: {islandSpriteIndex: ${randomSprite()},x: ${randomPos()}, y: ${randomPos()},spawnOffsetX: 100,spawnOffsetY: 0},`
//     )
//     .join("\n");
// }
// console.log(randomlyInitUnusedIslands());
