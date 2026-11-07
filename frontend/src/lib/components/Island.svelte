<script lang="ts" module>
import { type Format, FORMAT_TO_MEDIATYPE } from "#lib/backend.js";
import {
  ISLAND_CLUSTER_CENTERS,
  ISLAND_DATA,
  type IslandDatum,
} from "#lib/data/islandPlacements.js";
import { ISLAND_SPRITES } from "#lib/data/islandSprites.js";
import { Pos } from "#lib/utils.svelte.js";
import { world } from "#lib/world.svelte.js";

export class IslandManager {
  datum: IslandDatum;
  pos: Pos;

  isCompatible = $derived(
    isFormatCompatible(world.fileManager.file?.name, this.name),
  );

  constructor(
    datum: IslandDatum,
  ) {
    this.datum = datum;
    this.pos = $derived(
      Pos.add(this.datum.pos, ISLAND_CLUSTER_CENTERS[this.mediaType]),
    );
  }

  callBoat() {
    world.islandClickHandler(this);
  }

  get name() {
    return this.datum.name;
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
}

export const COLOR_SUBSTITIONS: Record<string, string> = {
  "#f9f2db": "var(--land)",
  "#F9F2DB": "var(--land)",

  "#4c2416": "var(--shore-shadow)",

  "#645157": "var(--line)",
  "#645257": "var(--line)",
  "#68565b": "var(--line)",
  "#66535a": "var(--line)",
  "#6d5a5f": "var(--line)",

  "#eadfce": "var(--tree-fill)",
  "#efe6d2": "var(--tree-fill)",
  "#e5dac9": "var(--tree-fill)",
  "#E5DAC9": "var(--tree-fill)",
};
</script>

<script lang="ts">
import type { MediaType } from "#lib/backend.js";
import { TOOLTIP_DATA } from "#lib/data/tooltipData.js";
import { isFormatCompatible } from "#lib/fileManager.svelte.js";
import Sprite from "./Sprite.svelte";

interface Props {
  me: IslandManager;
}

let { me }: Props = $props();

const NOT_ALLOWED_COLOR = "#ce2727";

const BORDER_COLOR_MAPPING: Record<MediaType, string> = {
  image: "#ffc067",
  audio: "#82ff66",
  video: "#af66ff",
  // docs: "#66c4ff",
};

let allowHover = $derived(world.banner.hide);

let hovered: boolean = $state(false);
let shadowOpacity = $derived(hovered && allowHover ? 1 : 0.7);
let borderColor = $derived(
  hovered && allowHover
    ? BORDER_COLOR_MAPPING[me.mediaType]
    : undefined,
);
let cursor = $derived(me.isCompatible ? undefined : "not-allowed");

let processedSvg: string = $derived.by(() => {
  let svg = me.sprite.svg;

  for (const key in COLOR_SUBSTITIONS) {
    const value = COLOR_SUBSTITIONS[key];
    svg = svg.replaceAll(key, value);
  }

  return svg;
});

$effect(() => {
  world.tooltip.target = hovered && allowHover ? me.name : null;
});
</script>

<Sprite
  left={me.pos.x}
  top={me.pos.y}
  width={me.sprite.width}
  {shadowOpacity}
  {borderColor}
  {cursor}
  borderWidth={2}
  handlers={{
    click: allowHover
      ? me.isCompatible
        ? () => {
          setTimeout(() => {
            if (!world.viewport.userIsDragging) me.callBoat();
          }, 100);
        }
        : () => {}
      : undefined,
    hover: () => (hovered = true),
    unhover: () => (hovered = false),
  }}
  label={TOOLTIP_DATA[me.name].title}
>{@html processedSvg}</Sprite>
