<script lang="ts">
  import { onMount } from "svelte";
  import type { Package } from "@s4tk/models";
  import type { ResourceKeyPair } from "@s4tk/models/types";
  import PackageEntryRow from "./PackageEntryRow.svelte";

  const { BinaryResourceType, TuningResourceType } = window.S4TK.enums;

  export let onClose: () => void;
  export let pkg: Package;
  export let selectedIndex: number;

  let showUnsupported = false;

  $: supportedEntries = pkg?.entries.filter(entryFilter);
  $: entries = showUnsupported ? pkg?.entries : supportedEntries;
  $: numHidden = (pkg?.size ?? 0) - (supportedEntries?.length ?? 0);
  $: hiddenText = `${numHidden} ${
    numHidden === 1 ? "entry uses" : "entries use"
  } unsupported encoding.`;

  function entryFilter(entry: ResourceKeyPair): boolean {
    return (
      entry.key.type === BinaryResourceType.StringTable ||
      entry.key.type === BinaryResourceType.SimData ||
      entry.key.type in TuningResourceType
    );
  }

  onMount(() => {
    selectedIndex = entries[0].id;
  });
</script>

<div id="entries-menu" class="px-half">
  <div class="w-100 flex-space-between">
    <p class="small-title">File Explorer</p>
    <button class="button-wrapper" on:click={onClose}>
      <img src="./assets/x.svg" class="is-svg" alt="Close" />
    </button>
  </div>
  <div>
    {#if pkg != undefined}
      {#if numHidden > 0}
        <div class="flex-center-v flex-gap-small mb-1 nowrap">
          <img
            src="./assets/warning-outline.svg"
            class="is-svg warning-svg"
            alt="Warning"
          />
          <p class="subtle-text my-0">{hiddenText}</p>
          <button
            class="button-wrapper"
            on:click={() => (showUnsupported = !showUnsupported)}
          >
            <p class="subtle-text my-0 underline accent-color-secondary">
              {showUnsupported ? "HIDE" : "SHOW"}
            </p>
          </button>
        </div>
      {/if}
      {#each entries as entry (entry.id)}
        <PackageEntryRow
          onClick={() => (selectedIndex = entry.id)}
          {entry}
          active={selectedIndex === entry.id}
        />
      {/each}
    {/if}
  </div>
</div>

<style lang="scss">
  #entries-menu {
    background-color: var(--color-bg-secondary);
    height: 100%;
    min-width: 200px;

    img {
      height: 1em;
      width: auto;
    }
  }
</style>
