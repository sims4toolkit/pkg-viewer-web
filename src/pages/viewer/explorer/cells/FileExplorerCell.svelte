<script lang="ts">
  import { DisplayType, ExplorerCell } from "lib/viewer/explorer-data";
  import TuningCellContent from "./TuningCellContent.svelte";
  import StringTableCellContent from "./StringTableCellContent.svelte";
  import DefaultCellContent from "./DefaultCellContent.svelte";

  export let cell: ExplorerCell;
  export let activeId: number;

  $: isActive = ExplorerCell.isActive(cell, activeId);
</script>

<div
  class="border-l-4 border-b border-solid border-l-transparent border-b-gray-300 dark:border-b-gray-700 explorer-cell hover:bg-gray-200 dark:hover:bg-gray-800"
  class:active-left-border={isActive}
>
  {#if cell.displayType === DisplayType.Tuning}
    <TuningCellContent {cell} {activeId} />
  {:else if cell.displayType === DisplayType.StringTable}
    <StringTableCellContent {cell} />
  {:else}
    <DefaultCellContent {cell} />
  {/if}
</div>

<style lang="scss">
  .active-left-border {
    border-left-color: var(--color-accent-secondary);
  }
</style>
