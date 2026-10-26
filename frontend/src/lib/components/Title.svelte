<script lang="ts">
interface Props {
  cornered: boolean;
}

let { cornered }: Props = $props();
</script>

<h1 class={cornered ? "cornered" : ""}>Hanova</h1>

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
	translate: 0 20vh;
	font-size: 6rem;

	@media (width <= 600px) {
		scale: 2;
	}

	animation: fadeIn 0.5s ease;

	&.cornered {
		translate: calc(50% - 3em) 0.3rem;
		font-size: 2rem;
	}
}
</style>
