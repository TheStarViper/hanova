<script lang="ts">
	import type { CubicBezier } from "#lib/bezier.js";
	import type { Pos } from "#lib/utils.svelte.js";
	import { draw, type TransitionConfig } from "svelte/transition";

	interface Props {
		curves: CubicBezier[] | undefined;
	}

	const DRAW_DURATION = 600;

	function hold(_node: Element): TransitionConfig {
		return {
			duration: DRAW_DURATION,
			css: () => "",
		};
	}

	let { curves }: Props = $props();

	const formatPos = (pos: Pos) => `${pos.x} ${pos.y}`;

	const makeM = (curve: CubicBezier) => `M ${formatPos(curve.p0)}`;

	const makeC = (curve: CubicBezier): string => {
		const points = [curve.p1, curve.p2, curve.p3].map(formatPos);
		return `C ${points.join(", ")}`;
	};

	const makeShape = (curves: CubicBezier[] | undefined): string => {
		if (curves === undefined || curves.length === 0) return "";

		const m = makeM(curves[0]);
		const c = curves.map(makeC).join("\n");

		return `${m}\n${c}`;
	};

	let width = $state(0);
	let height = $state(0);

	$effect(() => {
		if (curves === undefined || curves.length === 0) return;

		let w = curves[0].p0.x;
		let h = curves[0].p0.y;

		for (const curve of curves) {
			w = Math.max(w, curve.p3.x);
			h = Math.max(h, curve.p3.y);
		}

		width = w;
		height = h;
	});

	let d = $derived(makeShape(curves));
</script>

<div class="bezier-wrapper">
	<svg viewBox="0 0 {width + 20} {height + 20}" width={width + 20}>
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
