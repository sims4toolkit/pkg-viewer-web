<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import ViewerState from "lib/viewer/viewer-state";
  import ViewerEvents from "lib/viewer/viewer-events";
  import { RenderType } from "lib/viewer/index-data-types";
  import type { ViewableFileInfo } from "lib/viewer/index-data-types";
  import UploadPackagePanel from "./UploadPackagePanel.svelte";
  import ImageFileRenderer from "./renderers/ImageFileRenderer.svelte";
  import StringTableFileRenderer from "./renderers/StringTableFileRenderer.svelte";
  import UnrenderableRenderer from "./renderers/UnrenderableRenderer.svelte";
  import PlainTextRenderer from "./renderers/PlainTextRenderer.svelte";

  let info: ViewableFileInfo;

  const subscriptions = [
    ViewerEvents.onViewedFileChange.subscribe((newInfo) => {
      info = newInfo;
    }),
  ];

  onMount(() => {
    ViewerState.requestRefresh();
  });

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });
</script>

{#if Boolean(info)}
  {#if info.renderType === RenderType.PlainText}
    <PlainTextRenderer {info} />
  {:else if info.renderType === RenderType.StringTable}
    <StringTableFileRenderer {info} />
  {:else if info.renderType === RenderType.Image}
    <ImageFileRenderer {info} />
  {:else if info.renderType === RenderType.Corrupt}
    <UnrenderableRenderer
      {info}
      title="Corrupt"
      description="This file appears to be corrupt."
    />
  {:else if info.renderType === RenderType.Deleted}
    <UnrenderableRenderer
      {info}
      title="Deleted Record"
      description="Deleted records have no content."
    />
  {:else}
    <UnrenderableRenderer
      {info}
      title="Unsupported"
      description="This file type is not supported by S4TK."
    />
  {/if}
{:else}
  <UploadPackagePanel />
{/if}
