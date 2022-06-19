<script lang="ts">
  import { onMount } from "svelte";
  import type { Package } from "@s4tk/models";
  import PackageEntryRow from "./PackageEntryRow.svelte";
  import { isEncodingSupported } from "../../../typescript/helpers";
  import MovableWindow from "../../layout/MovableWindow.svelte";

  export let onClose: () => void;
  export let pkg: Package;
  export let selectedIndex: number;

  let showUnsupported = false;
  let showFilterWindow = true; // FIXME:

  $: supportedEntries = pkg?.entries.filter((e) =>
    isEncodingSupported(e.key.type)
  );
  $: entries = showUnsupported ? pkg?.entries : supportedEntries;
  $: numHidden = (pkg?.size ?? 0) - (supportedEntries?.length ?? 0);
  $: hiddenText = `${numHidden} ${
    numHidden === 1 ? "entry uses" : "entries use"
  } unsupported encoding.`;

  onMount(() => {
    selectedIndex = entries[0].id;
  });
</script>

<div id="entries-menu" class="px-half">
  <div class="w-100 flex-space-between">
    <p class="small-title">File Explorer</p>
    <div class="flex flex-gap">
      <button
        class="button-wrapper"
        on:click={() => (showFilterWindow = !showFilterWindow)}
        title="Filter"
      >
        <img src="./assets/filter.svg" class="is-svg" alt="Filter" />
      </button>
      <button class="button-wrapper" on:click={onClose} title="Close">
        <img src="./assets/x.svg" class="is-svg" alt="Close" />
      </button>
    </div>
  </div>
  <div class="entries-wrapper">
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

{#if showFilterWindow}
  <MovableWindow title="Filter" onClose={() => (showFilterWindow = false)} />
{/if}

<style lang="scss">
  #entries-menu {
    background-color: var(--color-bg-secondary);
    height: 100%;
    min-width: 200px;

    img {
      height: 1em;
      width: auto;
    }

    .entries-wrapper {
      overflow-y: auto;
      max-height: 92%;
    }
  }
</style>
