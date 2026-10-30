<script lang="ts">
import CompassSvg from "#lib/assets/compass.svg";
import { world } from "#lib/world.svelte.js";
import Sprite from "./Sprite.svelte";

interface Props {
  togglePage: () => void;
  label: string;
}

let { togglePage, label }: Props = $props();

let hovered = $state(false);
let borderColor = $derived(hovered ? "var(--accent)" : undefined);

let processedSvg = $derived(
  CompassSvg.replaceAll("#6e5c5e", "var(--compass-line)"),
);
</script>

<Sprite
  top={world.viewport.max.y - 180}
  left={world.viewport.max.x - 160}
  scale={world.viewport.mobile ? 0.7 : 1}
  sticky
  width={202}
  layer={101}
  {borderColor}
  shadowOpacity={0.5}
  handlers={{
    click: togglePage,
    hover: () => (hovered = true),
    unhover: () => (hovered = false),
  }}
  {label}
  labelColor={"var(--compass-label)"}
>{@html processedSvg}</Sprite>
