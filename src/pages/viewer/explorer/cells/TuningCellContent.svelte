<script lang="ts">
  import ViewerState from "lib/viewer/viewer-state";
  import type { TuningExplorerCell } from "lib/viewer/explorer-data";
  import DiagnosticsBubble from "pages/viewer/diagnostics/DiagnosticsBubble.svelte";

  export let cell: TuningExplorerCell;
  export let activeId: number;

  $: isSimDataActive = cell.simDataInfo?.id === activeId;
  $: hasSimData = Boolean(cell.simDataInfo);
  $: hasTuningDiagnostics = Boolean(cell.tuningInfo.diagnostics.length);
  $: hasSimDataDiagnostics = Boolean(cell.simDataInfo?.diagnostics.length);
  $: simDataGroup = cell.simDataInfo?.resourceKey.split("-")[1] ?? "Unknown";

  function onTuningClick() {
    ViewerState.requestFile(cell.tuningInfo.id, true);
  }

  function onSimDataClick() {
    ViewerState.requestFile(cell.simDataInfo.id, true);
  }
</script>

<button class="px-2 py-2 text-left w-full" on:click={onTuningClick}>
  {#if hasTuningDiagnostics}
    <div class="mb-1 w-full flex items-center justify-between">
      <p class="text-sm ellipsis-overflow">{cell.tuningInfo.displayName}</p>
      <DiagnosticsBubble diagnostics={cell.tuningInfo.diagnostics} />
    </div>
  {:else}
    <p class="mb-1 text-sm ellipsis-overflow">{cell.tuningInfo.displayName}</p>
  {/if}
  <p class="text-xs text-subtle monospace ellipsis-overflow">
    {cell.tuningInfo.resourceKey}
  </p>
</button>
{#if hasSimData}
  <div class="px-2 pb-2">
    <button
      class="w-full flex gap-2 items-center justify-between bg-gray-300 dark:bg-gray-800 px-2 py-1 rounded border border-solid border-gray-200 dark:border-gray-900 h-10 sm:h-8"
      class:active-border={isSimDataActive}
      on:click={onSimDataClick}
    >
      <div class="min-w-0 flex items-center gap-2">
        <img
          src="./assets/icons/link-outline.svg"
          alt="Link"
          class="h-4 w-4 svg"
        />
        <p class="text-sm ellipsis-overflow">
          SimData (<span class="monospace">{simDataGroup}</span>)
        </p>
      </div>
      {#if hasSimDataDiagnostics}
        <DiagnosticsBubble diagnostics={cell.simDataInfo.diagnostics} />
      {/if}
    </button>
  </div>
{/if}

<style lang="scss">
  .active-border {
    border-color: var(--color-accent-secondary) !important;
  }
</style>
