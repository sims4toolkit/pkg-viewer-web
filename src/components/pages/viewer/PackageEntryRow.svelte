<script lang="ts">
  import { formatResourceKey } from "@s4tk/hashing/formatting";
  import type { ResourceKeyPair } from "@s4tk/models/types";
  import { getDisplayName, getTypeDisplay } from "../../../typescript/helpers";

  export let onClick: () => void;
  export let entry: ResourceKeyPair;
  export let active: boolean;
</script>

<button class="button-wrapper w-100 text-left" on:click={onClick}>
  <div class="entry-row p-half mb-half mr-half" class:active>
    <p class="mt-0 mb-half nowrap">{getDisplayName(entry)}</p>
    <p class="small-title my-0 nowrap">
      {getTypeDisplay(entry.key.type, entry.key.group)}
    </p>
    <p class="small-title monospace my-0 nowrap">
      {formatResourceKey(entry.key)}
    </p>
  </div>
</button>

<style lang="scss">
  .entry-row {
    border-radius: 4px;
    overflow-x: hidden;
    border: 1px solid var(--color-bg-secondary);

    &.active {
      border-color: var(--color-text);
      background-color: var(--color-card);
    }

    &:not(.active):hover {
      cursor: pointer;
      background-color: var(--color-card);
    }
  }
</style>
