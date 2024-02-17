<script lang="ts">
  import { onDestroy } from "svelte";
  import type { DiagnosticInfo } from "@s4tk/validation";
  import Settings, { SettingsSubscriptionManager } from "lib/utils/settings";
  import { flatten } from "lib/utils/helpers";
  import Diagnostics from "lib/viewer/diagnostics";
  import ViewerEvents from "lib/viewer/viewer-events";
  import { ExplorerCell, ExplorerSection } from "lib/viewer/explorer-data";
  import ChevronToggle from "components/elements/ChevronToggle.svelte";
  import DiagnosticsBubble from "./DiagnosticsBubble.svelte";
  import DiagnosticsSectionButton from "./DiagnosticsSectionButton.svelte";
  import DiagnosticsSwimlane from "./DiagnosticsSwimlane.svelte";

  export let bottomIsCollapsed: boolean;

  let allDiagnosticsCount: number = 0;
  let allSections: readonly ExplorerSection[] = [];
  let searchTerm = "";

  let showThisFile = false;
  let fileDiagnostics: readonly DiagnosticInfo[] = [];
  let filteredDiagnostics: readonly DiagnosticInfo[] = [];
  let showDiagnosticCode = Settings.showDiagnosticCodesOnUi;

  $: currentDiagnostics = showThisFile ? fileDiagnostics : filteredDiagnostics;
  $: hasDiagnostics = Boolean(currentDiagnostics?.length);
  $: fileCountText = (fileDiagnostics?.length ?? 0).toString();
  $: allFilesCountText =
    filteredDiagnostics.length < allDiagnosticsCount
      ? `${filteredDiagnostics.length} of ${allDiagnosticsCount}`
      : allDiagnosticsCount.toString();

  const subscriptions = [
    ViewerEvents.onExplorerSectionsChange.subscribe((sections) => {
      allSections = sections;
      if (allSections?.length) {
        allDiagnosticsCount = flatten(
          ...flatten(...allSections.map((s) => s.cells)).map((c) =>
            ExplorerCell.allDiagnostics(c)
          )
        ).length;
      } else {
        allDiagnosticsCount = 0;
      }
      refreshFilteredDiagnostics();
    }),
    ViewerEvents.onViewedFileChange.subscribe((info) => {
      fileDiagnostics =
        info?.diagnostics.filter((d) => Diagnostics.passesSettings(d)) ?? [];
    }),
    ViewerEvents.onUserClickedFile.subscribe(() => {
      showThisFile = true;
    }),
    ViewerEvents.onSearchTermChange.subscribe((term) => {
      searchTerm = term;
      refreshFilteredDiagnostics();
    }),
    ViewerEvents.onPackageUnloaded.subscribe(() => {
      filteredDiagnostics = [];
    }),
    SettingsSubscriptionManager.subscribe("showDiagnosticCodesOnUi", (v) => {
      showDiagnosticCode = v;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  function refreshFilteredDiagnostics() {
    if (allSections?.length) {
      filteredDiagnostics = flatten(
        ...flatten(...allSections.map((s) => s.cells))
          .filter((c) => ExplorerCell.passesSearch(c, searchTerm))
          .map((c) => ExplorerCell.allDiagnostics(c))
      ).sort(Diagnostics.sorter);
    } else {
      fileDiagnostics = [];
    }
  }
</script>

<div class="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-800">
  <div class="p-2 w-full flex gap-2 items-center justify-between flex-wrap">
    <div class="flex gap-2 sm:gap-4">
      <DiagnosticsSectionButton
        title="All Files"
        countText={allFilesCountText}
        active={!showThisFile}
        onClick={() => (showThisFile = false)}
      />
      <DiagnosticsSectionButton
        title="This File"
        countText={fileCountText}
        active={showThisFile}
        onClick={() => (showThisFile = true)}
      />
    </div>
    <div class="flex gap-2 sm:gap-4">
      <DiagnosticsBubble diagnostics={currentDiagnostics} />
      <ChevronToggle bind:isCollapsed={bottomIsCollapsed} />
    </div>
  </div>
  {#if hasDiagnostics}
    <div class="w-full flex-1 overflow-y-auto">
      {#each currentDiagnostics as info}
        <DiagnosticsSwimlane {info} {showDiagnosticCode} />
      {/each}
    </div>
  {:else}
    <div class="px-2 overflow-auto">
      <p class="text-sm">No issues found</p>
    </div>
  {/if}
</div>
