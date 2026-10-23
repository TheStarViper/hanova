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

	transition: translate 0.5s ease-in-out, scale 0.4s ease-in-out;

	color: var(--ink);
	text-shadow: 1px 1px rgba(0,0,0,0.2);

	translate: 0 20vh;
	scale: 3;

	animation: fadeIn 0.5s ease;

	&.cornered {
		translate: calc(50% - 3em) 0.3rem;
		scale: 1;
	}
}
</style>
