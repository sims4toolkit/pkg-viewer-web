<script lang="ts">
  import { onMount } from "svelte";
  import type { Package } from "@s4tk/models";
  import PackageEntryRow from "./PackageEntryRow.svelte";
  import {
    getDefaultFilters,
    getDisplayName,
    isEncodingSupported,
  } from "../../../typescript/helpers";
  import type { ResourceEntry, ResourceKeyPair } from "@s4tk/models/types";
  import { formatResourceInstance } from "@s4tk/hashing/formatting";
  import { StringTableLocale } from "@s4tk/models/enums";
  import FilterWindow from "./FilterWindow.svelte";
  import type { EntryFilterSettings } from "../../../global";

  const { BinaryResourceType } = window.S4TK.enums;

  export let onClose: () => void;
  export let onWarningClick: () => void;
  export let pkg: Package;
  export let warnings: Map<number, string[]>;
  export let selectedIndex: number;

  let showFilterWindow = false;
  let filteredEntries = [];
  let filterSettings: EntryFilterSettings = getDefaultFilters();

  $: numFilteredOut = pkg.size - filteredEntries.length;
  $: filteredText = `${numFilteredOut} ${
    numFilteredOut === 1 ? "entry" : "entries"
  } hidden by filters`;

  $: {
    filterSettings.fileType;
    filterSettings.filename;
    filterSettings.instanceHex;
    filterSettings.showNonEnStbls;
    filterSettings.showUnsupported;
    filterSettings.simDataGroup;
    filterSettings.stblLocale;

    filteredEntries = pkg.entries.filter(entryFilter);
  }

  onMount(() => {
    selectedIndex = filteredEntries[0]?.id ?? 0; // FIXME:
  });

  function entryFilter(entry: ResourceEntry): boolean {
    // FIXME: very ugly, very bad, hate hate hate

    if (!filterSettings.showUnsupported) {
      if (!isEncodingSupported(entry)) return false;
    }

    if (!filterSettings.showNonEnStbls) {
      if (
        entry.key.type === BinaryResourceType.StringTable &&
        !(
          StringTableLocale.getLocale(entry.key.instance) ===
          StringTableLocale.English
        )
      )
        return false;
    }

    if (filterSettings.fileType) {
      if (entry.key.type !== filterSettings.fileType) return false;

      if (filterSettings.fileType === BinaryResourceType.SimData) {
        if (
          filterSettings.simDataGroup &&
          filterSettings.simDataGroup !== entry.key.group
        )
          return false;
      }

      if (filterSettings.fileType === BinaryResourceType.StringTable) {
        if (
          filterSettings.stblLocale !== null &&
          !(
            StringTableLocale.getLocale(entry.key.instance) ===
            filterSettings.stblLocale
          )
        )
          return false;
      }
    }

    if (
      filterSettings.filename &&
      !getDisplayName(entry)
        .toLowerCase()
        .includes(filterSettings.filename.toLowerCase())
    )
      return false;

    if (
      filterSettings.instanceHex &&
      !formatResourceInstance(entry.key.instance).includes(
        filterSettings.instanceHex.toUpperCase()
      )
    )
      return false;

    return true;
  }

  function clearFilters() {
    filterSettings = getDefaultFilters();
    filterSettings.showUnsupported = true;
    filterSettings.showNonEnStbls = true;
  }
</script>

<div id="entries-menu" class="px-half">
  <div class="w-100 flex-space-between">
    <p class="small-title">Files</p>
    <div class="flex flex-gap">
      <button
        class="button-wrapper flex-center-v flex-gap-small"
        on:click={() => (showFilterWindow = !showFilterWindow)}
        title="Filter"
      >
        <img src="./assets/filter.svg" class="is-svg" alt="Filter" />
        <p class="my-0 subtle-text">Filter</p>
      </button>
      <button
        class="button-wrapper flex-center-v flex-gap-small"
        on:click={onClose}
        title="Close"
      >
        <img src="./assets/x.svg" class="is-svg" alt="Close" />
        <p class="my-0 subtle-text">Close</p>
      </button>
    </div>
  </div>
  <div class="entries-wrapper">
    {#if pkg != undefined}
      {#if filteredEntries && filteredEntries?.length !== pkg.size}
        <div class="flex-center-v flex-space-between mb-1 nowrap">
          <div class="flex-center-v flex-gap-small">
            <img
              src="./assets/warning-outline.svg"
              class="is-svg warning-svg"
              alt="Warning"
            />
            <p class="subtle-text my-0">
              {filteredText}
            </p>
          </div>
          <button class="button-wrapper" on:click={clearFilters}>
            <p class="subtle-text my-0 underline accent-color-secondary">
              CLEAR
            </p>
          </button>
        </div>
      {/if}
      {#if filteredEntries?.length}
        {#each filteredEntries as entry (entry.id)}
          <PackageEntryRow
            onClick={() => (selectedIndex = entry.id)}
            {onWarningClick}
            {entry}
            warnings={warnings.get(entry.id)}
            active={selectedIndex === entry.id}
          />
        {/each}
      {:else}
        <div class="no-entries-container flex-center">
          <h3>No entries found.</h3>
        </div>
      {/if}
    {/if}
  </div>
</div>

{#if showFilterWindow}
  <FilterWindow
    bind:filterSettings
    onClose={() => (showFilterWindow = false)}
  />
{/if}

<style lang="scss">
  #entries-menu {
    background-color: var(--color-bg-secondary);
    height: 100%;
    min-width: 200px;

    img {
      height: 1.2em;
      width: auto;
    }

    .entries-wrapper {
      overflow-y: auto;
      max-height: 92%;
    }

    .no-entries-container {
      height: 100%;
      width: 100%;
      text-align: center;

      h3 {
        color: var(--color-text-subtle);
      }
    }
  }
</style>
