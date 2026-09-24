<!-- reusable SVG wrapper component -->

<script lang="ts">
	import { onMount } from "svelte";

	interface Props {
		svgHTML: string;

		top: number;
		left: number;

		hide?: boolean;

		// recommended to set one of these to auto
		width?: number;
		height?: number;

		handlers?: {
			click?: () => void;
			hover?: () => void;
			unhover?: () => void;
		};
	}

	let { svgHTML, top, left, hide, width, height, handlers }: Props = $props();

	let el: HTMLElement;

	$effect(() => {
		if (handlers === undefined) return;

		const { click, hover, unhover } = handlers;

		if (click) el.addEventListener("pointerdown", click);
		if (hover) el.addEventListener("mouseenter", hover);
		if (unhover) el.addEventListener("mouseleave", unhover);
	});
</script>

<div
	bind:this={el}
	class="svg-wrapper"
	style:opacity={hide ? "0" : "1"}
	style:top="{top}px"
	style:left="{left}px"
	style:width={width !== undefined ? `${width}px` : "auto"}
	style:height={height !== undefined ? `${height}px` : "auto"}
>
	{@html svgHTML}
</div>

<style lang="scss">
	.svg-wrapper {
		position: absolute;
		opacity: 0;
		transform: translate(-50%, -50%);
	}
</style>
