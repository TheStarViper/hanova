import type { IslandDatum } from "#lib/island.svelte.js";
import { Pos } from "#lib/utils.svelte.js";

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
  {
    name: "mp3",
    pos: new Pos(2000, 1000),
    islandSpriteIndex: 9,
    spawnOffset: new Pos(-200, 30),
  },
] as const satisfies IslandDatum[];
