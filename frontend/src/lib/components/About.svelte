<script lang="ts">
import {
  type Format,
  FORMAT_TO_MEDIATYPE,
  type MediaType,
} from "#lib/backend.js";
import { TOOLTIP_DATA, type TooltipDatum } from "#lib/data/tooltipData.js";
import { world } from "#lib/world.svelte.js";

const tooltips = Object.entries(TOOLTIP_DATA) as [Format, TooltipDatum][];

function mediaTypeList(mediaType: MediaType): string {
  return tooltips
    .filter(([format]) => FORMAT_TO_MEDIATYPE[format] === mediaType)
    .map(([, tooltip]) => `<a href="${tooltip.url}">${tooltip.title}</a>`)
    .join(", ");
}
</script>

<article id="about">
  <h1>About Hanova</h1>

  <blockquote>
    Welcome to Hanova, a (fictional) archipelago off the coast of Madagascar!
  </blockquote>

  <p>
    "Hanova" is the Malagasy word for "convert", and that's exactly what these
    islands do. Drag-and-drop your file into the water, and sail it to the
    island corresponding to your desired file format. Dig at the red X, and
    you'll unearth buried treasure: your converted file!
  </p>

  <section id="settings">
    <h2>Settings</h2>
    <p>Hanova has a few settings that you can configure:</p>
    <div>
      <label for="quality">Conversion Quality</label>
      <input id="quality" type="range" bind:value={world.quality} />
      <label for="quality" class="percent">{world.quality}%</label>
    </div>
  </section>

  <section id="formats">
    <h2>Supported File Formats</h2>
    <p>Image: {@html mediaTypeList("image")}</p>
    <p>Audio: {@html mediaTypeList("audio")}</p>
    <p>Video: {@html mediaTypeList("video")}</p>
    <p>Document: (coming soon!)</p>
  </section>

  <section id="source">
    <h2>Source Code</h2>
    <p>
      Check out our repo: <a href="https://github.com/TheStarViper/hanova"
      >https://github.com/TheStarViper/hanova</a>
    </p>
  </section>

  <footer>
    Made by <a href="https://github.com/ethmarks">Ethan</a> (Svelte frontend) &
    <wbr />
    <a href="https://github.com/TheStarViper">Andrew</a> (C++ backend)
  </footer>
</article>

<style lang="scss">
h1,
h2 {
	text-align: center;
}

h2 {
	font-size: 1.2rem;
	margin-top: 3rem;
}

article {
	margin: 5% auto;
	color: var(--ink);
	max-width: 60ch;
	padding: 1rem;
	max-height: 100%;
	overflow-y: scroll;
}

p {
	margin-block: 0.5rem;
}

section#formats p {
	text-indent: 2ch hanging;
}

:global {
	#about {
		a,
		a:visited {
			color: var(--accent);
		}
	}
}

blockquote {
	width: fit-content;
	margin: 1rem auto;
	background: var(--bg-accent);
	padding: 0.6rem 1rem;
	border-radius: 0.4rem;
	outline: 4px double var(--line);
}

footer {
	margin-top: 3rem;
	text-align: center;
}

#settings {
	div {
		display: flex;
		justify-content: space-between;
		gap: 1rem;

		width: fit-content;
		margin: 1rem auto;
		background: var(--bg-accent);
		padding: 0.3rem 0.8rem;
		border-radius: 0.4rem;
		outline: 4px double var(--line);

		.percent {
			min-width: 4ch;
		}

		label:last-of-type {
			text-align: right;
		}

		input[type="range"] {
			background: none;

			@mixin range-track {
				background: var(--compass-bg);
				border: 3px double var(--line);
				box-shadow: 2px 2px color-mix(var(--line), transparent 30%);
				height: 8px;
				border-radius: 5px;
			}

			@mixin range-thumb {
				width: 20px;
				height: 20px;
				background: var(--line);
				box-shadow: 1px 1px color-mix(var(--ink), transparent 30%);
				border: none;
				outline: 1px solid var(--compass-bg);
				outline-offset: -3px;
				border-radius: 50%;
				cursor: pointer;
			}

			&::-webkit-slider-runnable-track {
				@include range-track;
			}

			&::-moz-range-track {
				@include range-track;
			}

			&::-webkit-slider-thumb {
				@include range-thumb;
				-webkit-appearance: none;
				margin-top: -7px;
			}

			&::-moz-range-thumb {
				@include range-thumb;
			}
		}
	}
}
</style>
