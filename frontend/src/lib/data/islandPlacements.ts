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
};

export const ISLAND_DATA: Partial<Record<Format, IslandDatum>> = {
  bmp: {
    x: 0,
    y: 500,
    islandSpriteIndex: 18,
    spawnOffsetX: 0,
    spawnOffsetY: -160,
  },
  gif: {
    x: 0,
    y: 800,
    islandSpriteIndex: 6,
    spawnOffsetX: 50,
    spawnOffsetY: 100,
  },
  jpg: {
    x: 400,
    y: 550,
    islandSpriteIndex: 16,
    spawnOffsetX: 200,
    spawnOffsetY: 20,
  },
  jxl: {
    x: 600,
    y: 880,
    islandSpriteIndex: 8,
    spawnOffsetX: -100,
    spawnOffsetY: 100,
  },
  png: {
    x: 200,
    y: 100,
    islandSpriteIndex: 17,
    spawnOffsetX: 250,
    spawnOffsetY: -100,
  },
  webp: {
    x: 850,
    y: 240,
    islandSpriteIndex: 15,
    spawnOffsetX: 160,
    spawnOffsetY: -120,
  },
  avif: {
    x: 1300,
    y: -200,
    islandSpriteIndex: 14,
    spawnOffsetX: -130,
    spawnOffsetY: 100,
  },
  tiff: {
    x: 900,
    y: -150,
    islandSpriteIndex: 19,
    spawnOffsetX: 90,
    spawnOffsetY: 170,
  },
  eps: {
    x: 1500,
    y: 150,
    islandSpriteIndex: 11,
    spawnOffsetX: -40,
    spawnOffsetY: 200,
  },
  exr: {
    x: 1050,
    y: -500,
    islandSpriteIndex: 15,
    spawnOffsetX: -200,
    spawnOffsetY: 0,
  },
  tga: {
    x: 1370,
    y: 570,
    islandSpriteIndex: 18,
    spawnOffsetX: 0,
    spawnOffsetY: -150,
  },
  hdr: {
    x: 1650,
    y: 510,
    islandSpriteIndex: 14,
    spawnOffsetX: -170,
    spawnOffsetY: -80,
  },
  svg: {
    x: 300,
    y: -250,
    islandSpriteIndex: 8,
    spawnOffsetX: 100,
    spawnOffsetY: 100,
  },
  ico: {
    x: 550,
    y: -350,
    islandSpriteIndex: 18,
    spawnOffsetX: 150,
    spawnOffsetY: 0,
  },
  psd: {
    x: 1000,
    y: 1000,
    islandSpriteIndex: 9,
    spawnOffsetX: -200,
    spawnOffsetY: 30,
  },
  mp3: {
    x: 0,
    y: 0,
    islandSpriteIndex: 16,
    spawnOffsetX: -200,
    spawnOffsetY: 30,
  },
  wav: {
    x: -500,
    y: 0,
    islandSpriteIndex: 10,
    spawnOffsetX: 0,
    spawnOffsetY: 240,
  },
  ogg: {
    x: -200,
    y: -400,
    islandSpriteIndex: 15,
    spawnOffsetX: -80,
    spawnOffsetY: 90,
  },
  flac: {
    x: 500,
    y: -400,
    islandSpriteIndex: 10,
    spawnOffsetX: -180,
    spawnOffsetY: -50,
  },
  aac: {
    x: -700,
    y: -300,
    islandSpriteIndex: 18,
    spawnOffsetX: 0,
    spawnOffsetY: -150,
  },
  m4a: {
    x: -800,
    y: -480,
    islandSpriteIndex: 6,
    spawnOffsetX: 100,
    spawnOffsetY: 0,
  },
  mp4: {
    x: 0,
    y: 0,
    islandSpriteIndex: 17,
    spawnOffsetX: -200,
    spawnOffsetY: 30,
  },
  mov: {
    x: -430,
    y: 500,
    islandSpriteIndex: 14,
    spawnOffsetX: -60,
    spawnOffsetY: -180,
  },
  webm: {
    x: 100,
    y: 600,
    islandSpriteIndex: 15,
    spawnOffsetX: -40,
    spawnOffsetY: -140,
  },
  mkv: {
    x: -500,
    y: -200,
    islandSpriteIndex: 19,
    spawnOffsetX: 130,
    spawnOffsetY: 140,
  },
  ts: {
    x: 500,
    y: 300,
    islandSpriteIndex: 18,
    spawnOffsetX: -100,
    spawnOffsetY: 100,
  },
};
