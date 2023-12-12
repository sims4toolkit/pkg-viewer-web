<script lang="ts">
  import ViewerState from "lib/viewer/viewer-state";
  import type { UnspecifiedExplorerCell } from "lib/viewer/explorer-data";
  import DiagnosticsBubble from "pages/viewer/diagnostics/DiagnosticsBubble.svelte";

  export let cell: UnspecifiedExplorerCell;

  $: hasDiagnostics = Boolean(cell.info.diagnostics.length);

  function onClick() {
    ViewerState.requestFile(cell.info.id, true);
  }
</script>

<button class="px-2 py-2 text-left w-full" on:click={onClick}>
  {#if hasDiagnostics}
    <div class="mb-1 w-full flex items-center justify-between">
      <p class="text-sm ellipsis-overflow">{cell.info.displayName}</p>
      <DiagnosticsBubble diagnostics={cell.info.diagnostics} />
    </div>
  {:else}
    <p class="mb-1 text-sm ellipsis-overflow">{cell.info.displayName}</p>
  {/if}
  <p class="text-xs text-subtle monospace ellipsis-overflow">
    {cell.info.resourceKey}
  </p>
</button>
