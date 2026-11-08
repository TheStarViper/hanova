import type { Format, MediaType } from "#lib/backend.js";
import { Pos } from "#lib/utils.svelte.js";
import type { IslandSpriteIndex } from "./islandSprites";

export interface IslandDatum {
  pos: Pos;
  islandSpriteIndex: IslandSpriteIndex;
  spawnOffset: Pos;
}

export const ISLAND_CLUSTER_CENTERS: Record<MediaType, Pos> = {
  image: new Pos(0, 0),
  audio: new Pos(2000, -1500),
  video: new Pos(3500, -500),
};

export const ISLAND_DATA: Partial<Record<Format, IslandDatum>> = {
  // Image
  bmp: {
    pos: new Pos(0, 500),
    islandSpriteIndex: 18,
    spawnOffset: new Pos(0, -160),
  },
  gif: {
    pos: new Pos(0, 800),
    islandSpriteIndex: 6,
    spawnOffset: new Pos(50, 100),
  },
  jpg: {
    pos: new Pos(400, 550),
    islandSpriteIndex: 16,
    spawnOffset: new Pos(200, 20),
  },
  jxl: {
    pos: new Pos(600, 880),
    islandSpriteIndex: 8,
    spawnOffset: new Pos(-100, 100),
  },
  png: {
    pos: new Pos(200, 100),
    islandSpriteIndex: 17,
    spawnOffset: new Pos(250, -100),
  },
  webp: {
    pos: new Pos(850, 240),
    islandSpriteIndex: 15,
    spawnOffset: new Pos(160, -120),
  },
  avif: {
    pos: new Pos(1300, -200),
    islandSpriteIndex: 14,
    spawnOffset: new Pos(-130, 100),
  },
  tiff: {
    pos: new Pos(900, -150),
    islandSpriteIndex: 19,
    spawnOffset: new Pos(90, 170),
  },
  eps: {
    pos: new Pos(1500, 150),
    islandSpriteIndex: 11,
    spawnOffset: new Pos(-40, 200),
  },
  exr: {
    pos: new Pos(1050, -500),
    islandSpriteIndex: 15,
    spawnOffset: new Pos(-200, 0),
  },
  tga: {
    pos: new Pos(1370, 570),
    islandSpriteIndex: 18,
    spawnOffset: new Pos(0, -150),
  },
  hdr: {
    pos: new Pos(1650, 510),
    islandSpriteIndex: 14,
    spawnOffset: new Pos(-170, -80),
  },
  svg: {
    pos: new Pos(300, -250),
    islandSpriteIndex: 8,
    spawnOffset: new Pos(100, 100),
  },
  ico: {
    pos: new Pos(550, -350),
    islandSpriteIndex: 18,
    spawnOffset: new Pos(150, 0),
  },
  psd: {
    pos: new Pos(1000, 1000),
    islandSpriteIndex: 9,
    spawnOffset: new Pos(-200, 30),
  },

  // Audio
  mp3: {
    pos: new Pos(0, 0),
    islandSpriteIndex: 16,
    spawnOffset: new Pos(-200, 30),
  },
  wav: {
    pos: new Pos(-500, 0),
    islandSpriteIndex: 10,
    spawnOffset: new Pos(0, 240),
  },
  ogg: {
    pos: new Pos(-200, -400),
    islandSpriteIndex: 15,
    spawnOffset: new Pos(-80, 90),
  },
  flac: {
    pos: new Pos(500, -400),
    islandSpriteIndex: 10,
    spawnOffset: new Pos(-180, -50),
  },
  aac: {
    pos: new Pos(-700, -300),
    islandSpriteIndex: 18,
    spawnOffset: new Pos(0, -150),
  },
  m4a: {
    pos: new Pos(-800, -480),
    islandSpriteIndex: 6,
    spawnOffset: new Pos(100, 0),
  },

  // Video
  mp4: {
    pos: new Pos(0, 0),
    islandSpriteIndex: 17,
    spawnOffset: new Pos(-200, 30),
  },
  mov: {
    pos: new Pos(-430, 500),
    islandSpriteIndex: 14,
    spawnOffset: new Pos(-60, -180),
  },
  webm: {
    pos: new Pos(100, 600),
    islandSpriteIndex: 15,
    spawnOffset: new Pos(-40, -140),
  },
  mkv: {
    pos: new Pos(-500, -200),
    islandSpriteIndex: 19,
    spawnOffset: new Pos(130, 140),
  },
  ts: {
    pos: new Pos(500, 300),
    islandSpriteIndex: 18,
    spawnOffset: new Pos(-100, 100),
  },
};
