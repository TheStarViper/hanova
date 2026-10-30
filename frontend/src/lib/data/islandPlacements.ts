import { type Format, FORMAT_TO_MEDIATYPE, FORMATS } from "#lib/backend.js";
import { Pos } from "#lib/utils.svelte.js";
import type { IslandSpriteIndex } from "./islandSprites";

const IMAGE_ISLANDS_OFFSET = new Pos(0, 0);
const AUDIO_ISLANDS_OFFSET = new Pos(2000, -1500);
const VIDEO_ISLANDS_OFFSET = new Pos(3500, -500);

export interface IslandDatum {
  name: Format;
  pos: Pos;
  islandSpriteIndex: IslandSpriteIndex;
  spawnOffset: Pos;
}

const IMAGE_ISLANDS: IslandDatum[] = [
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
];

const AUDIO_ISLANDS: IslandDatum[] = [
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
];

const VIDEO_ISLANDS: IslandDatum[] = [
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

IMAGE_ISLANDS.forEach((i) => i.pos = Pos.add(i.pos, IMAGE_ISLANDS_OFFSET));
AUDIO_ISLANDS.forEach((i) => i.pos = Pos.add(i.pos, AUDIO_ISLANDS_OFFSET));
VIDEO_ISLANDS.forEach((i) => i.pos = Pos.add(i.pos, VIDEO_ISLANDS_OFFSET));

export const ISLAND_DATA = [
  ...IMAGE_ISLANDS,
  ...AUDIO_ISLANDS,
  ...VIDEO_ISLANDS,
];

function islandCompletenessReport() {
  const formatsWithIslands = ISLAND_DATA.map((i) => i.name);
  const missingFormats = FORMATS.filter((f) => !formatsWithIslands.includes(f));

  console.log(
    `${missingFormats.length}/${FORMATS.length} formats have islands`,
  );

  const missingImageFormats = missingFormats.filter((f) =>
    FORMAT_TO_MEDIATYPE[f] === "image"
  );
  const missingAudioFormats = missingFormats.filter((f) =>
    FORMAT_TO_MEDIATYPE[f] === "audio"
  );
  const missingVideoFormats = missingFormats.filter((f) =>
    FORMAT_TO_MEDIATYPE[f] === "video"
  );

  if (missingImageFormats) {
    console.log(`missing image formats: ${missingImageFormats.join(", ")}`);
  }
  if (missingAudioFormats) {
    console.log(`missing audio formats: ${missingAudioFormats.join(", ")}`);
  }
  if (missingVideoFormats) {
    console.log(`missing video formats: ${missingVideoFormats.join(", ")}`);
  }
}

// islandCompletenessReport();
