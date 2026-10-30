<!-- reusable SVG wrapper component -->

<script lang="ts">
import type { Viewport } from "#lib/viewport.svelte.js";
import type { Snippet } from "svelte";

interface Props {
  children: Snippet<[]>;

  top: number;
  left: number;

  /**
   * I'm making this use an explicit null value rather than just
   * undefined so that I don't forget to implement it everywhere
   */
  viewport: Viewport | null;

  label?: string;
  labelColor?: string;

  hide?: boolean;

  width?: number;
  height?: number;
  scale?: number;

  handlers?: {
    click?: () => void;
    hover?: () => void;
    unhover?: () => void;
  };

  /** z index */
  layer?: number;

  shadowOpacity?: number;
  borderColor?: string;
  borderWidth?: number;

  sunk?: boolean;
}

let { children, ...props }: Props = $props();

let el: HTMLElement;

$effect(() => {
  if (props.handlers === undefined) return;

  const { click, hover, unhover } = props.handlers;

  if (click) el.addEventListener("pointerdown", click);
  if (hover) el.addEventListener("mouseenter", hover);
  if (unhover) el.addEventListener("mouseleave", unhover);
});
</script>

<div
  bind:this={el}
  class="svg-wrapper {props.sunk ? 'sunk' : ''}"
  style:opacity={props.hide ? "0" : "1"}
  style:top="{props.top + (props.viewport?.offset.y ?? 0)}px"
  style:left="{props.left + (props.viewport?.offset.x ?? 0)}px"
  style:width={props.width !== undefined ? `${props.width}px` : "auto"}
  style:height={props.height !== undefined ? `${props.height}px` : "auto"}
  style:scale={props.scale ?? 1}
  style:z-index={props.layer ?? 0}
  style:cursor={props.handlers?.click !== undefined ? "pointer" : ""}
  style:--shadow-opacity={props.shadowOpacity ?? 0}
  style:--border-color={props.borderColor ?? "transparent"}
  style:--border-width="{props.borderWidth ?? 1}px"
  style:pointer-events={props.handlers === undefined ? "none" : "auto"}
>
  {@render children()}
  <span style:color={props.labelColor}>{props.label}</span>
</div>

<style lang="scss">
.svg-wrapper {
	position: absolute;
	transform: translate(-50%, -50%);

	display: flex;
	flex-direction: column;
	align-items: center;

	& > :global(:not(span)) {
		filter: drop-shadow(var(--border-width) 0 0 var(--border-color))
			drop-shadow(
				calc(var(--border-width) * -1) 0 0 var(--border-color)
			)
			drop-shadow(0 var(--border-width) 0 var(--border-color))
			drop-shadow(
				0 calc(var(--border-width) * -1) 0 var(--border-color)
			);
		transition: filter 0.3s ease;
	}

	filter: drop-shadow(0 0 30px hsl(41 40% 60% / var(--shadow-opacity)));

	transition-duration: 0.3s;
	transition-timing-function: ease;
	transition-property: filter, opacity;

	span {
		font-style: italic;
		user-select: none;
		color: var(--ink);
	}
}

.sunk {
	animation: sink 1s ease both;
}

@keyframes sink {
	from {
		transform: translate(-50%, -50%);
		clip-path: xywh(0 0 100% 100%);
	}
	to {
		transform: translate(-50%, 0) rotate(6deg);
		clip-path: xywh(0 0 100% 0);
	}
}
</style>
