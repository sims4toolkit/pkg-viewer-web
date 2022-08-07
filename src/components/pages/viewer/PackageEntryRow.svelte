<script lang="ts">
  import { formatResourceKey } from "@s4tk/hashing/formatting";
  import type { ResourceKeyPair } from "@s4tk/models/types";
  import type { EntryViewSettings } from "../../../global";
  import { getDisplayName, getTypeDisplay } from "../../../typescript/helpers";

  export let onClick: () => void;
  export let onWarningClick: () => void;
  export let entry: ResourceKeyPair;
  export let active: boolean;
  export let warnings: string[];
  export let viewSettings: EntryViewSettings;
  export let entriesMenuElement: HTMLDivElement;

  let rowButton: HTMLButtonElement;

  $: resourceKey =
    viewSettings.resourceKeyFormat === 0
      ? formatResourceKey(entry.key)
      : entry.key.instance;

  $: {
    if (active && rowButton && entriesMenuElement) scrollToElement();
  }

  async function scrollToElement() {
    const menuRect = entriesMenuElement.getBoundingClientRect();
    const rowRect = rowButton.getBoundingClientRect();

    const topBound = menuRect.y;
    const bottomBound = menuRect.y + menuRect.height;
    const topPixel = rowRect.y;
    const bottomPixel = rowRect.y + rowRect.height;

    if (topPixel < topBound || bottomPixel > bottomBound) {
      rowButton.scrollIntoView();
    }
  }
</script>

<button
  bind:this={rowButton}
  class="button-wrapper w-100 text-left"
  on:click={onClick}
>
  <div class="entry-row p-half mb-half mr-half" class:active>
    <p class="mt-0 mb-half nowrap">{getDisplayName(entry)}</p>
    <p class="small-title my-0 nowrap">
      {getTypeDisplay(entry.key.type, entry.key.group)}
    </p>
    <p class="small-title monospace my-0 nowrap">
      {resourceKey}
    </p>
    {#if warnings}
      <button
        class="button-wrapper warning-img-wrapper flex-center drop-shadow"
        on:click={onWarningClick}
      >
        <img
          src="./assets/warning-outline.svg"
          class="is-svg dark-svg"
          alt="Warning"
          title="This entry has warnings!"
        />
        <p class="my-0 monospace">{warnings.length}</p>
      </button>
    {/if}
  </div>
</button>

<style lang="scss">
  .entry-row {
    position: relative;
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

    .warning-img-wrapper {
      background-color: var(--color-warning);
      opacity: 0.8;
      position: absolute;
      z-index: 512;
      top: 5px;
      right: 5px;
      height: 20px;
      min-width: 40px;
      border-radius: 4px;
      padding: 2px;
      gap: 4px;

      img {
        max-height: 16px;
      }

      p {
        color: var(--color-dark);
        font-size: 0.8em !important;
      }
    }
  }
</style>
