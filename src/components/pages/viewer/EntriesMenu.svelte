<script lang="ts">
  import type { Package } from "@s4tk/models";
  import PackageEntryRow from "./PackageEntryRow.svelte";

  export let onClose: () => void;
  export let selectEntry: (index: number) => void;
  export let pkg: Package;
  export let selectedIndex: number;
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
      {#each pkg.entries as entry (entry.id)}
        <PackageEntryRow
          onClick={() => selectEntry(entry.id)}
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
  }
</style>
