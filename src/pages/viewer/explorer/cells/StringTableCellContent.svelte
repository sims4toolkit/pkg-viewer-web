<script lang="ts">
  import ViewerState from "lib/viewer/viewer-state";
  import { ExplorerCell } from "lib/viewer/explorer-data";
  import type { StringTableExplorerCell } from "lib/viewer/explorer-data";
  import DiagnosticsBubble from "pages/viewer/diagnostics/DiagnosticsBubble.svelte";
  import type { StringTableFileInfo } from "lib/viewer/index-data-types";
  import Diagnostics from "lib/viewer/diagnostics";

  export let cell: StringTableExplorerCell;
  let localeSelect: HTMLSelectElement;

  $: chosenInfo = cell.localeChoices[cell.chosenLocaleIndex];
  $: allDiagnostics = ExplorerCell.allDiagnostics(cell);
  $: hasDiagnostics = Boolean(allDiagnostics.length);

  function onClick() {
    ViewerState.requestFile(chosenInfo.id, true);
  }

  function onLocaleChange() {
    cell.chosenLocaleIndex = parseInt(localeSelect.value);
    const info = cell.localeChoices[cell.chosenLocaleIndex];
    ViewerState.requestFile(info.id, true);
  }

  function getLocaleIssuesText(locale: StringTableFileInfo): string {
    const count = locale.diagnostics.filter((d) =>
      Diagnostics.passesSettings(d)
    ).length;

    if (count === 0) return "";
    if (count === 1) return " (1 issue)";
    return ` (${count} issues)`;
  }
</script>

<button class="px-2 py-2 text-left w-full" on:click={onClick}>
  {#if hasDiagnostics}
    <div class="mb-1 w-full flex items-center justify-between">
      <p class="text-sm ellipsis-overflow">{cell.filterName}</p>
      <DiagnosticsBubble diagnostics={allDiagnostics} />
    </div>
  {:else}
    <p class="mb-1 text-sm ellipsis-overflow">{cell.filterName}</p>
  {/if}
  <p class="text-xs text-subtle monospace ellipsis-overflow">
    {cell.sharedResourceKey}
  </p>
</button>
<div class="px-2 pb-2">
  <select
    bind:this={localeSelect}
    class="w-full flex gap-2 items-center bg-gray-300 dark:bg-gray-800 px-2 py-1 rounded border border-solid border-gray-200 dark:border-gray-900 text-sm h-10 sm:h-8"
    on:change={onLocaleChange}
  >
    {#each cell.localeChoices as option, index}
      <option value={index}
        >{option.displayName}{getLocaleIssuesText(option)}</option
      >
    {/each}
  </select>
</div>
