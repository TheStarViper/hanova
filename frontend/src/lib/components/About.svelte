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
  <section id="top">
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
  </section>

  <section id="settings">
    <h2>Settings</h2>
    <div>
      <label for="quality">Conversion Quality</label>
      <input id="quality" type="range" bind:value={world.quality} />
      <label for="quality" class="percent">{world.quality}%</label>
    </div>
  </section>

  <section id="formats">
    <h2>Supported File Formats</h2>
    <p>Images: {@html mediaTypeList("image")}</p>
    <p>Audio: {@html mediaTypeList("audio")}</p>
    <p>Videos: {@html mediaTypeList("video")}</p>
    <p>Documents: (coming soon!)</p>
  </section>

  <section id="history">
    <h2>History</h2>
    <p>
      Hanova was created over the span of 7 weeks, for <a
        href="https://thirdspace.hackclub.com/home"
      >Third Space</a>. Andrew wanted to make a file converter backend, Ethan
      wanted to make an antique nautical map UI, and Hanova was the resulting
      compromise.
    </p>
    <p>
      The name 'Hanova' was chosen by running the word 'convert' through random
      languages in Google Translate until we found one that sounded novel and
      interesting. (our backup was 'Umbreyta' from Icelandic).
    </p>
  </section>

  <section id="source">
    <h2>Source</h2>
    <p>
      Source on GitHub here: <a href="https://github.com/TheStarViper/hanova"
      >https://github.com/TheStarViper/hanova</a>
    </p>
    <p>Contributors:</p>
    <ul>
      <li>
        Ethan (<a href="https://github.com/ethmarks">@ethmarks</a>): Frontend
        with Svelte and TypeScript
      </li>
      <li>
        Andrew (<a href="https://github.com/TheStarViper">@TheStarViper</a>):
        Backend with C++ and JavaScript
      </li>
    </ul>
  </section>
</article>

<style lang="scss">
h1,
h2 {
  text-align: center;
}

h2 {
  font-size: 1.2rem;
}

article {
  min-width: 100%;
  height: 100%;
  color: var(--ink);
  overflow-y: scroll;

  & > :last-child {
    margin-bottom: 3rem;

    @media (width < 1400px) {
      padding-bottom: 15rem;
    }

    @media (width < 600px) {
      padding-bottom: 10rem;
    }
  }
}

p {
  margin-block: 0.5rem;
}

section {
  margin: 3rem auto 0;
  max-width: 60ch;
  padding-inline: 1rem;
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

    @media (width < 600px) {
      flex-direction: column;
      text-align: center;
    }

    @media (width >= 600px) {
      label:last-of-type {
        text-align: right;
      }
    }

    .percent {
      min-width: 4ch;
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
