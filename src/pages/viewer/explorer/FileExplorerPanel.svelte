<script lang="ts">
  import { onDestroy } from "svelte";
  import type { ExplorerSection } from "lib/viewer/explorer-data";
  import ViewerEvents from "lib/viewer/viewer-events";
  import ViewerState from "lib/viewer/viewer-state";
  import FileExplorerToolbar from "./FileExplorerToolbar.svelte";
  import FileExplorerSection from "./FileExplorerSection.svelte";
  import DownloadButton from "./DownloadButton.svelte";

  let searchTerm: string = "";
  let sections: readonly ExplorerSection[];
  let activeId = -1;

  $: hasSections = Boolean(sections?.length);

  const subscriptions = [
    ViewerEvents.onExplorerSectionsChange.subscribe((newSections) => {
      sections = newSections;
    }),
    ViewerEvents.onViewedFileChange.subscribe((info) => {
      activeId = info?.id ?? -1;
    }),
    ViewerEvents.onSearchTermChange.subscribe((term) => {
      searchTerm = term;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  const downloadZip = () => ViewerState.downloadAllFiles();
  const downloadFile = () => ViewerState.downloadCurrentFile();
  const downloadPackage = () => ViewerState.downloadCurrentPackage();
</script>

<div class="bg-gray-100 dark:bg-gray-900 h-full w-full">
  {#if hasSections}
    <div class="h-full w-full relative">
      <div
        class="absolute top-0 right-0 left-0 h-10 border-b border-solid border-b-gray-300 dark:border-b-gray-700"
      >
        <FileExplorerToolbar bind:sections />
      </div>
      <div class="absolute top-10 right-0 bottom-10 left-0 overflow-y-auto">
        {#each sections as section}
          <FileExplorerSection {searchTerm} {section} {activeId} />
        {/each}
      </div>
      <div
        class="absolute bottom-0 right-0 left-0 h-10 px-2 py-1 flex items-center gap-2 border-t border-solid border-t-gray-300 dark:border-t-gray-700"
      >
        <img
          src="./assets/icons/download.svg"
          alt="download"
          class="svg h-4 w-4"
        />
        <DownloadButton text="ZIP" onClick={downloadZip} />
        <DownloadButton text="Package" onClick={downloadPackage} />
        <DownloadButton text="File" onClick={downloadFile} />
      </div>
    </div>
  {:else}
    <div class="h-full flex items-center justify-center">
      <p class="text-subtle text-center">No files loaded</p>
    </div>
  {/if}
</div>
