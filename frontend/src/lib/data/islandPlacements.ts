import type { Format, MediaType } from "#lib/backend.js";
import { Pos } from "#lib/utils.svelte.js";
import type { IslandSpriteIndex } from "./islandSprites";

export interface IslandDatum {
  name: Format;
  pos: Pos;
  islandSpriteIndex: IslandSpriteIndex;
  spawnOffset: Pos;
}

export const ISLAND_CLUSTER_CENTERS: Record<MediaType, Pos> = {
  image: new Pos(0, 0),
  audio: new Pos(2000, -1500),
  video: new Pos(3500, -500),
  document: new Pos(-3000, -3000),
  model: new Pos(-3000, 3000),
};

export const ISLAND_DATA: IslandDatum[] = [
  // Image
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

  // Audio
  {
    name: "mp3",
    pos: new Pos(0, 0),
    islandSpriteIndex: 16,
    spawnOffset: new Pos(-200, 30),
  },
  {
    name: "wav",
    pos: new Pos(-500, 0),
    islandSpriteIndex: 10,
    spawnOffset: new Pos(0, 240),
  },
  {
    name: "ogg",
    pos: new Pos(-200, -400),
    islandSpriteIndex: 15,
    spawnOffset: new Pos(-80, 90),
  },
  {
    name: "flac",
    pos: new Pos(500, -400),
    islandSpriteIndex: 10,
    spawnOffset: new Pos(-180, -50),
  },
  {
    name: "aac",
    pos: new Pos(-700, -300),
    islandSpriteIndex: 18,
    spawnOffset: new Pos(0, -150),
  },
  {
    name: "m4a",
    pos: new Pos(-800, -480),
    islandSpriteIndex: 6,
    spawnOffset: new Pos(100, 0),
  },

  // Video
  {
    name: "mp4",
    pos: new Pos(0, 0),
    islandSpriteIndex: 17,
    spawnOffset: new Pos(-200, 30),
  },
  {
    name: "mov",
    pos: new Pos(-430, 500),
    islandSpriteIndex: 14,
    spawnOffset: new Pos(-60, -180),
  },
  {
    name: "webm",
    pos: new Pos(100, 600),
    islandSpriteIndex: 15,
    spawnOffset: new Pos(-40, -140),
  },
  {
    name: "mkv",
    pos: new Pos(-500, -200),
    islandSpriteIndex: 19,
    spawnOffset: new Pos(130, 140),
  },
  {
    name: "ts",
    pos: new Pos(500, 300),
    islandSpriteIndex: 18,
    spawnOffset: new Pos(-100, 100),
  },
];
