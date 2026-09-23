<main>
	<h1>Hanova</h1>
</main>

<style lang="scss">
	main {
		width: 100%;
		height: 100%;
		position: relative;
		outline: 2px solid var(--line);

		display: flex;
		justify-content: right;

		&::before {
			content: "";
			position: absolute;
			inset: 0;
			outline: 1px solid var(--line);
			outline-offset: 0.4rem;
			pointer-events: none;
		}

		h1 {
			margin-top: 0.3rem;
			margin-right: 0.6rem;
		}
	}
</style>
