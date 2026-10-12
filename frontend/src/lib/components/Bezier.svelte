<script lang="ts">
	import type { CubicBezier } from "#lib/bezier.js";
	import type { Pos } from "#lib/utils.svelte.js";
	import { draw, type TransitionConfig } from "svelte/transition";

	interface Props {
		curves: CubicBezier[] | undefined;
		viewportOffset: Pos;
	}

	let { curves, viewportOffset }: Props = $props();

	const DRAW_DURATION = 600;
	const PADDING = 20;

	let { minX, minY, width, height } = $derived.by(() => {
		if (curves === undefined || curves.length === 0)
			return { minX: 0, minY: 0, width: 0, height: 0 };

		let min_x = Infinity;
		let min_y = Infinity;
		let max_x = -Infinity;
		let max_y = -Infinity;

		for (const curve of curves) {
			const points = [curve.p0, curve.p1, curve.p2, curve.p3];
			for (const pt of points) {
				min_x = Math.min(min_x, pt.x);
				min_y = Math.min(min_y, pt.y);
				max_x = Math.max(max_x, pt.x);
				max_y = Math.max(max_y, pt.y);
			}
		}

		return {
			minX: min_x - PADDING / 2,
			minY: min_y - PADDING / 2,
			width: max_x - min_x + PADDING,
			height: max_y - min_y + PADDING,
		};
	});

	let d = $derived.by(() => {
		if (curves === undefined || curves.length === 0) return "";

		const formatPos = (pos: Pos) => `${pos.x} ${pos.y}`;
		const makeM = (curve: CubicBezier) => `M ${formatPos(curve.p0)}`;
		const makeC = (curve: CubicBezier): string => {
			const points = [curve.p1, curve.p2, curve.p3].map(formatPos);
			return `C ${points.join(", ")}`;
		};

		const m = makeM(curves[0]);
		const c = curves.map(makeC).join("\n");

		return `${m}\n${c}`;
	});

	let offset = $derived({
		x: viewportOffset.x + minX,
		y: viewportOffset.y + minY,
	});

	/**
	 * little helper function to prevent the display path from disappearing
	 * while the mask path is doing the draw transition
	 */
	const hold = (_node: Element): TransitionConfig => ({
		duration: DRAW_DURATION,
		css: () => "",
	});
</script>

<div class="bezier-wrapper">
	<svg
		viewBox="{minX} {minY} {width} {height}"
		{width}
		{height}
		style="transform: translate({offset.x}px, {offset.y}px);"
	>
		<defs>
			<mask id="reveal">
				{#key d}
					<path
						{d}
						fill="none"
						stroke="white"
						stroke-width="10"
						transition:draw={{ duration: DRAW_DURATION }}
					/>
				{/key}
			</mask>
		</defs>
		{#key d}
			<path
				{d}
				fill="none"
				stroke="var(--line)"
				stroke-width="1.5"
				stroke-dasharray="10"
				mask="url(#reveal)"
				out:hold
			/>
		{/key}
	</svg>
</div>

<style lang="scss">
	.bezier-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
	}
</style>
