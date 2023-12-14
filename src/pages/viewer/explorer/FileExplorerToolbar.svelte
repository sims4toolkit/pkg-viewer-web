<script lang="ts">
  import ViewerState from "lib/viewer/viewer-state";
  import type { ExplorerSection } from "lib/viewer/explorer-data";
  import ConfirmDialogue from "components/elements/ConfirmDialogue.svelte";

  export let sections: readonly ExplorerSection[];

  let searchTerm: string = "";
  let isConfirmingRefresh: boolean = false;

  $: {
    ViewerState.requestSearch(searchTerm);
  }

  $: allCollapsed = sections?.every((section) => section.collapsed);
  $: collapseExpandTitle = allCollapsed ? "Expand All" : "Collapse All";
  $: collapseExpandImg = allCollapsed ? "expand" : "collapse";

  function collapseExpandAll() {
    const newCollapsed = !allCollapsed;
    sections.forEach((section) => (section.collapsed = newCollapsed));
    sections = sections;
  }

  function clearSearch() {
    searchTerm = "";
  }

  function resetViewer() {
    isConfirmingRefresh = false;
    ViewerState.unloadPackage({ requestRefresh: true });
  }
</script>

<div class="h-full w-full flex items-center justify-between gap-4 px-2">
  <div class="flex-shrink-0 flex items-center gap-2">
    <button
      class="flex-shrink-0"
      title="Reset Viewer"
      on:click={() => (isConfirmingRefresh = true)}
      ><img
        src="./assets/icons/refresh.svg"
        alt={collapseExpandImg}
        class="svg h-4 w-4 tint-on-hover"
      /></button
    >
    <button
      class="flex-shrink-0"
      title={collapseExpandTitle}
      on:click={collapseExpandAll}
      ><img
        src="./assets/icons/chevron-{collapseExpandImg}-outline.svg"
        alt={collapseExpandImg}
        class="svg h-5 w-5 tint-on-hover"
      /></button
    >
  </div>
  <!-- FIXME: search overtakes buttons when panel small -->
  <div
    class="basis-full p-1 flex gap-1 items-center rounded bg-gray-300 dark:bg-gray-800"
    style="max-width: 196px;"
  >
    <img src="./assets/icons/search.svg" alt="search" class="svg h-4 w-4" />
    <input
      type="text"
      class="flex-1 rounded bg-transparent min-w-0 w-0 text-sm placeholder-gray-500"
      placeholder="Search"
      bind:value={searchTerm}
    />
    {#if Boolean(searchTerm)}
      <button title="Clear" on:click={clearSearch}
        ><img
          src="./assets/icons/x.svg"
          alt="clear"
          class="svg h-4 w-4"
        /></button
      >
    {/if}
  </div>
</div>

{#if isConfirmingRefresh}
  <ConfirmDialogue
    title="Refresh Viewer"
    description="Are you sure you want to refresh the viewer? You will be able to upload another package."
    confirmText="Reload Viewer"
    cancelText="Cancel"
    onConfirm={resetViewer}
    onCancel={() => (isConfirmingRefresh = false)}
  ></ConfirmDialogue>
{/if}
