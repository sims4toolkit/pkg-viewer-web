<script lang="ts">
  import { onDestroy } from "svelte";
  import ViewerEvents from "lib/viewer/viewer-events";
  import ViewerState from "lib/viewer/viewer-state";
  import SplitView from "components/layout/SplitView.svelte";
  import TopBottomSplitView from "components/layout/TopBottomSplitView.svelte";
  import FileExplorerPanel from "./explorer/FileExplorerPanel.svelte";
  import EditorPanelDelegate from "./editor/EditorPanelDelegate.svelte";
  import DiagnosticsPanel from "./diagnostics/DiagnosticsPanel.svelte";

  let loadedPackageName: string;
  let bottomIsCollapsed: boolean = false;

  $: pageName = loadedPackageName ? loadedPackageName : "S4TK Package Viewer";

  const subscriptions = [
    ViewerEvents.onPackageNameChange.subscribe((packageName) => {
      loadedPackageName = packageName;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  function onCompactChange() {
    ViewerState.requestRefresh();
  }
</script>

<svelte:head>
  <title>{pageName}</title>
</svelte:head>

<section class="pt-10 h-screen w-screen">
  <SplitView compactTitle="File Explorer" {onCompactChange}>
    <FileExplorerPanel slot="secondary" />
    <TopBottomSplitView slot="primary" bind:bottomIsCollapsed>
      <EditorPanelDelegate slot="top" />
      <DiagnosticsPanel slot="bottom" bind:bottomIsCollapsed />
    </TopBottomSplitView>
  </SplitView>
</section>
