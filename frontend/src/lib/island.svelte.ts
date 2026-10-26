import { Ellipse, Pos } from "./utils.svelte";

import { type Format, FORMAT_TO_MEDIATYPE } from "./backend";
import { ISLAND_DATA } from "./data/islandPlacements";
import { ISLAND_SPRITES } from "./data/islandSprites";

export interface IslandSprite {
  svg: string;
  width: number;
  treasureOffset: Pos;
  bound: Ellipse;
}

type IslandSpriteIndex = keyof typeof ISLAND_SPRITES;

export interface IslandDatum {
  name: Format;
  pos: Pos;
  islandSpriteIndex: IslandSpriteIndex;
  spawnOffset: Pos;
}

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

  get mediaType() {
    return FORMAT_TO_MEDIATYPE[this.datum.name];
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
