<script lang="ts">
import {
  type Format,
  FORMAT_TO_MEDIATYPE,
  FORMATS,
  MEDIA_TYPES,
  type MediaType,
} from "#lib/backend.js";
import { ISLAND_DATA } from "#lib/data/islandPlacements.js";

const mediatypeToFormat: Partial<Record<MediaType, Format[]>> = Object.groupBy(
  FORMATS,
  (format) => FORMAT_TO_MEDIATYPE[format],
);

let rowCount = Object.values(mediatypeToFormat)
  .map((arr) => arr.length)
  .toSorted()[0];

type Cell = [Format, boolean];

const getMediaTypeRecord = () =>
  Object.fromEntries(
    MEDIA_TYPES.map((mediaType) => [mediaType, 0]),
  ) as Record<MediaType, number>;

const totalCounts = getMediaTypeRecord();
const hasIslandCounts = getMediaTypeRecord();

const makeRow = (index: number): (Cell | undefined)[] =>
  MEDIA_TYPES.map((mediaType) => {
    const formats = mediatypeToFormat[mediaType];
    if (formats === undefined) throw new Error("unreachable");

    const format = formats[index];
    if (format === undefined) return undefined;

    const hasIsland = ISLAND_DATA[format] !== null;

    totalCounts[mediaType]++;
    if (hasIsland) hasIslandCounts[mediaType]++;

    return [format, hasIsland];
  });

let rows = Array.from({ length: rowCount }).map((_, index) => makeRow(index));
</script>

<h1>Island Completeness</h1>

<div class="table-container">
  <table>
    <thead>
      <tr>
        {#each MEDIA_TYPES as mediaType}
          <th scope="col">
            {mediaType} ({hasIslandCounts[mediaType]}/{totalCounts[mediaType]})
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          {#each row as cell}
            {#if cell === undefined}
              <td></td>
            {:else}
              <td class={cell[1] ? "yes" : "no"}>{cell[0]}</td>
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style lang="scss">
h1 {
  text-align: center;
}

.table-container {
  max-width: 100%;
  max-height: 100%;
  overflow: auto;

  table {
    margin-inline: auto;
    border-spacing: 1rem 0.2rem;
    text-align: center;

    td {
      &.yes {
        color: #66d64d;
      }
      &.no {
        color: red;
      }
    }
  }
}
</style>
