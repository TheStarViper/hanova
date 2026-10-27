<script lang="ts">
import { Viewport } from "#lib/viewport.svelte.js";

interface Props {
  cornered: boolean;
  viewport: Viewport;
}

let { cornered, viewport }: Props = $props();

let fontSizeRem: number = $derived(cornered ? 2 : viewport.mobile ? 3 : 6);
let translateX: string = $derived(cornered ? "calc(50% - 3em)" : "0");
let translateY: string = $derived(
  cornered ? "0.3rem" : viewport.mobile ? "25vh" : "20vh",
);
</script>

<h1
  style:font-size="{fontSizeRem}rem"
  style:translate="{translateX} {translateY}"
>
  Hanova
</h1>

<style lang="scss">
h1 {
	position: absolute;
	user-select: none;
	pointer-events: none;
	z-index: 100;
	width: 100%;
	text-align: center;

	color: color-mix(var(--ink), white 5%);
	text-shadow: 3px 3px rgba(0,0,0,0.2), -2px -2px rgba(255,255,255, 0.8);

	transition: translate 0.5s ease-in-out, font-size 0.4s ease-in-out;

	animation: fadeIn 0.5s ease;
}
</style>
