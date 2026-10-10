<!-- reusable SVG wrapper component -->

<script lang="ts">
	import type { Pos } from "#lib/utils.svelte.js";
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet<[]>;

		top: number;
		left: number;

		/**
		 * im making this mandatory so that I don't forget to implement it on
		 * every component
		 */
		viewportOffset: Pos;

		label?: string;

		hide?: boolean;

		width?: number;
		height?: number;

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
	style:top="{props.top + props.viewportOffset.y}px"
	style:left="{props.left + props.viewportOffset.x}px"
	style:width={props.width !== undefined ? `${props.width}px` : "auto"}
	style:height={props.height !== undefined ? `${props.height}px` : "auto"}
	style:z-index={props.layer ?? 0}
	style:cursor={props.handlers?.click !== undefined ? "pointer" : ""}
	style:--shadow-opacity={props.shadowOpacity ?? 0}
	style:--border-color={props.borderColor ?? "transparent"}
	style:--border-width="{props.borderWidth ?? 1}px"
	style:pointer-events={props.handlers === undefined ? "none" : "auto"}
>
	{@render children()}
	<span>{props.label}</span>
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
