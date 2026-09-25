<!-- reusable SVG wrapper component -->

<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet<[]>;

		top: number;
		left: number;

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
	class="svg-wrapper"
	style:opacity={props.hide ? "0" : "1"}
	style:top="{props.top}px"
	style:left="{props.left}px"
	style:width={props.width !== undefined ? `${props.width}px` : "auto"}
	style:height={props.height !== undefined ? `${props.height}px` : "auto"}
	style:z-index={props.layer ?? 0}
	style:cursor={props.handlers?.click !== undefined ? "pointer" : ""}
	style:--shadow-opacity={props.shadowOpacity ?? 0}
	style:pointer-events={props.handlers?.click === undefined ? "none" : "auto"}
>
	{@render children()}
	<span>{props.label}</span>
</div>

<style lang="scss">
	.svg-wrapper {
		position: absolute;
		opacity: 0;
		transform: translate(-50%, -50%);

		display: flex;
		flex-direction: column;
		align-items: center;

		transition: filter 0.2s ease;
		filter: drop-shadow(0 0 30px hsl(41 40% 60% / var(--shadow-opacity)));

		span {
			font-style: italic;
			user-select: none;
		}
	}
</style>
