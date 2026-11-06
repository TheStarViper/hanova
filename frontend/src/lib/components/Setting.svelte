<script lang="ts" module>
export const SETTINGS = [
  "quality",
  "filenameTemplate",
] as const satisfies (keyof World)[];
export type Setting = (typeof SETTINGS)[number];
</script>

<script lang="ts">
import InfoSvg from "#lib/assets/info.svg";
import { TOOLTIP_DATA } from "#lib/data/tooltipData.js";
import { World, world } from "#lib/world.svelte.js";
import { onMount } from "svelte";

interface Props {
  field: Setting;
}

let { field }: Props = $props();

let hoverEl: HTMLElement;

onMount(() => {
  hoverEl.addEventListener("mouseenter", () => {
    world.tooltip.target = field;
  });
  hoverEl.addEventListener("mouseleave", () => {
    world.tooltip.target = null;
  });
});
</script>

<div>
  <label for={field}>{TOOLTIP_DATA[field]?.title}
    <span bind:this={hoverEl}>{@html InfoSvg}</span>
  </label>

  {#if field === "quality"}
    <input
      id={field}
      type="range"
      bind:value={world[field]}
    />
    <label for={field} class="percent">{world[field]}%</label>
  {:else if field === "filenameTemplate"}
    <input
      id={field}
      type="text"
      bind:value={world[field]}
    />
  {/if}
</div>

<style lang="scss">
div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 1rem;

  width: 100%;
  margin: 1rem auto;
  background: var(--bg-accent);
  padding: 0.3rem 0.8rem;
  border-radius: 0.4rem;
  outline: 4px double var(--line);

  @media (width < 600px) {
    flex-direction: column;
    text-align: center;
  }

  .percent {
    min-width: 4ch;
  }

  label {
    display: flex;
    gap: 0.5rem;

    span {
      color: var(--line);

      @media (pointer: coarse) {
        display: none;
      }
    }
  }

  input {
    flex: 1 1 0;
  }

  input[type="range"] {
    background: none;

    @mixin range-track {
      background: var(--compass-bg);
      border: 3px double var(--line);
      box-shadow: 2px 2px color-mix(var(--line), transparent 30%);
      height: 8px;
      border-radius: 5px;
    }

    @mixin range-thumb {
      width: 20px;
      height: 20px;
      background: var(--line);
      box-shadow: 1px 1px color-mix(var(--ink), transparent 30%);
      border: none;
      outline: 1px solid var(--compass-bg);
      outline-offset: -3px;
      border-radius: 50%;
      cursor: pointer;
    }

    &::-webkit-slider-runnable-track {
      @include range-track;
    }

    &::-moz-range-track {
      @include range-track;
    }

    &::-webkit-slider-thumb {
      @include range-thumb;
      -webkit-appearance: none;
      margin-top: -7px;
    }

    &::-moz-range-thumb {
      @include range-thumb;
    }
  }

  input[type="text"] {
    background: var(--compass-bg);
    border-radius: 5px;
    border: 3px double var(--line);
    box-shadow: 2px 2px color-mix(var(--line), transparent 30%);
    height: 2rem;

    &:focus {
      outline: none;
    }
  }
}
</style>
