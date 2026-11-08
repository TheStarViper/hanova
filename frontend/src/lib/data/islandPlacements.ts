import type { Format, MediaType } from "#lib/backend.js";
import { Pos } from "#lib/utils.svelte.js";
import type { IslandSpriteIndex } from "./islandSprites";

export interface IslandDatum {
  x: number;
  y: number;
  islandSpriteIndex: IslandSpriteIndex;
  spawnOffsetX: number;
  spawnOffsetY: number;
}

export const ISLAND_CLUSTER_CENTERS: Record<MediaType, Pos> = {
  image: new Pos(0, 0),
  audio: new Pos(2000, -1500),
  video: new Pos(3500, -500),
  document: new Pos(-3000, -3000),
  model: new Pos(-3000, 3000),
};

export const ISLAND_DATA: Partial<Record<Format, IslandDatum>> = {
  bmp: {
    islandSpriteIndex: 18,
    x: 0,
    y: 500,
    spawnOffsetX: 0,
    spawnOffsetY: -160,
  },
  gif: {
    islandSpriteIndex: 6,
    x: 0,
    y: 800,
    spawnOffsetX: 50,
    spawnOffsetY: 100,
  },
  jpg: {
    islandSpriteIndex: 16,
    x: 400,
    y: 550,
    spawnOffsetX: 200,
    spawnOffsetY: 20,
  },
  jxl: {
    islandSpriteIndex: 8,
    x: 600,
    y: 880,
    spawnOffsetX: -100,
    spawnOffsetY: 100,
  },
  png: {
    islandSpriteIndex: 17,
    x: 200,
    y: 100,
    spawnOffsetX: 250,
    spawnOffsetY: -100,
  },
  webp: {
    islandSpriteIndex: 15,
    x: 849,
    y: 240,
    spawnOffsetX: 160,
    spawnOffsetY: -120,
  },
  avif: {
    islandSpriteIndex: 14,
    x: 1300,
    y: -200,
    spawnOffsetX: -130,
    spawnOffsetY: 100,
  },
  tiff: {
    islandSpriteIndex: 19,
    x: 900,
    y: -150,
    spawnOffsetX: 90,
    spawnOffsetY: 170,
  },
  eps: {
    islandSpriteIndex: 11,
    x: 1500,
    y: 150,
    spawnOffsetX: -40,
    spawnOffsetY: 200,
  },
  exr: {
    islandSpriteIndex: 15,
    x: 1050,
    y: -500,
    spawnOffsetX: -200,
    spawnOffsetY: 0,
  },
  tga: {
    islandSpriteIndex: 18,
    x: 1370,
    y: 570,
    spawnOffsetX: 0,
    spawnOffsetY: -150,
  },
  hdr: {
    islandSpriteIndex: 14,
    x: 1650,
    y: 510,
    spawnOffsetX: -170,
    spawnOffsetY: -80,
  },
  svg: {
    islandSpriteIndex: 8,
    x: 300,
    y: -250,
    spawnOffsetX: 100,
    spawnOffsetY: 100,
  },
  ico: {
    islandSpriteIndex: 18,
    x: 550,
    y: -350,
    spawnOffsetX: 150,
    spawnOffsetY: 0,
  },
  psd: {
    islandSpriteIndex: 9,
    x: 1000,
    y: 1000,
    spawnOffsetX: -200,
    spawnOffsetY: 30,
  },
  mp3: {
    islandSpriteIndex: 16,
    x: 0,
    y: 0,
    spawnOffsetX: -200,
    spawnOffsetY: 30,
  },
  wav: {
    islandSpriteIndex: 10,
    x: -500,
    y: 0,
    spawnOffsetX: 0,
    spawnOffsetY: 240,
  },
  ogg: {
    islandSpriteIndex: 15,
    x: -200,
    y: -400,
    spawnOffsetX: -80,
    spawnOffsetY: 90,
  },
  flac: {
    islandSpriteIndex: 10,
    x: 500,
    y: -400,
    spawnOffsetX: -180,
    spawnOffsetY: -50,
  },
  aac: {
    islandSpriteIndex: 18,
    x: -700,
    y: -300,
    spawnOffsetX: 0,
    spawnOffsetY: -150,
  },
  m4a: {
    islandSpriteIndex: 6,
    x: -800,
    y: -480,
    spawnOffsetX: 100,
    spawnOffsetY: 0,
  },
  mp4: {
    islandSpriteIndex: 17,
    x: 0,
    y: 0,
    spawnOffsetX: -200,
    spawnOffsetY: 30,
  },
  mov: {
    islandSpriteIndex: 14,
    x: -430,
    y: 500,
    spawnOffsetX: -60,
    spawnOffsetY: -180,
  },
  webm: {
    islandSpriteIndex: 15,
    x: 100,
    y: 600,
    spawnOffsetX: -40,
    spawnOffsetY: -140,
  },
  mkv: {
    islandSpriteIndex: 19,
    x: -500,
    y: -200,
    spawnOffsetX: 130,
    spawnOffsetY: 140,
  },
  ts: {
    islandSpriteIndex: 18,
    x: 500,
    y: 300,
    spawnOffsetX: -100,
    spawnOffsetY: 100,
  },
};
