<!-- reusable SVG wrapper component -->

<script lang="ts">
	interface Props {
		svgHTML: string;

		top: number;
		left: number;

		hide?: boolean;

		// recommended to set one of these to auto
		width?: number;
		height?: number;
	}

	let { svgHTML, top, left, hide, width, height }: Props = $props();
</script>

<div
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
		pointer-events: none;
		transform: translate(-50%, -50%);
	}
</style>
