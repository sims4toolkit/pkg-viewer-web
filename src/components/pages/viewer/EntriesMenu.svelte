<script lang="ts">
  import type { Package } from "@s4tk/models";

  export let onClose: () => void;

  export let pkg: Package;
</script>

<div id="entries-menu">
  <div class="w-100 flex-end">
    <button class="button-wrapper" on:click={onClose}>
      <img src="./assets/x.svg" class="is-svg" alt="Close" />
    </button>
  </div>
  <div>
    {#if pkg != undefined}
      {#each pkg.entries as entry, key (key)}
        <div class="flex">
          {entry.key.instance}
        </div>
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
