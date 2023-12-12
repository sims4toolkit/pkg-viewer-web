<script lang="ts">
  import { flatten } from "lib/utils/helpers";
  import { ExplorerCell, ExplorerSection } from "lib/viewer/explorer-data";
  import DiagnosticsBubble from "pages/viewer/diagnostics/DiagnosticsBubble.svelte";
  import FileExplorerCell from "./cells/FileExplorerCell.svelte";
  const { passesSearch, allDiagnostics } = ExplorerCell;

  export let searchTerm: string;
  export let section: ExplorerSection;
  export let activeId: number;

  $: iconSrc = section.collapsed ? "chevron-right" : "chevron-down";
  $: visibleCells = section.cells.filter((c) => passesSearch(c, searchTerm));
  $: visibleDiagnostics = flatten(...visibleCells.map(allDiagnostics));
  $: containsActiveId = section.cells.some((c) => c.containedIds.has(activeId));
  $: countText =
    visibleCells.length < section.cells.length
      ? `${visibleCells.length} of ${section.cells.length}`
      : section.cells.length;

  function toggleCollapsed() {
    section.collapsed = !section.collapsed;
  }
</script>

<div class="w-full">
  <button
    class="bg-gray-300 dark:bg-gray-1000 w-full px-2 py-1 flex justify-between items-center border-l-4 border-solid border-l-gray-300 dark:border-l-gray-1000 h-10 sm:h-8"
    class:active-left-border={section.collapsed && containsActiveId}
    class:opacity-20={!visibleCells?.length}
    class:stick-to-top={!section.collapsed}
    on:click={toggleCollapsed}
  >
    <p
      class="text-sm text-gray-700 dark:text-white whitespace-nowrap text-ellipsis overflow-hidden"
    >
      {section.title} ({countText})
    </p>
    {#if section.collapsed}
      <div class="flex-shrink-0 ml-3 flex items-center gap-2">
        <DiagnosticsBubble diagnostics={visibleDiagnostics} />
        <img
          src="./assets/icons/{iconSrc}.svg"
          alt={iconSrc}
          class="svg h-3 w-3"
        />
      </div>
    {:else}
      <img
        src="./assets/icons/{iconSrc}.svg"
        alt={iconSrc}
        class="svg h-3 w-3 ml-3"
      />
    {/if}
  </button>
  <hr class="border-gray-200 dark:border-gray-900" />
  {#if !section.collapsed}
    {#each visibleCells as cell}
      <FileExplorerCell {cell} {activeId} />
    {/each}
  {/if}
</div>

<style lang="scss">
  .active-left-border {
    border-left-color: var(--color-accent-secondary);
  }

  .stick-to-top {
    position: sticky;
    top: 0;
    z-index: 10;
  }
</style>
