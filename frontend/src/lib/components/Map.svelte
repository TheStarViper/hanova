<main></main>

<style lang="scss">
	main {
		width: 100%;
		height: 100%;
		position: relative;
		outline: 2px solid var(--line);

		&::before {
			content: "";
			position: absolute;
			inset: 0;
			outline: 1px solid var(--line);
			outline-offset: 0.4rem;
			pointer-events: none;
		}
	}
</style>
