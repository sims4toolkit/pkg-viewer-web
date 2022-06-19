<script lang="ts">
  import { onMount } from "svelte";
  import { navbarTextStore, navbarTitleType } from "../../../typescript/stores";
  import PrismWrapper from "../../layout/PrismWrapper.svelte";
  import EntriesMenu from "./EntriesMenu.svelte";
  import ResizableSplitView from "../../layout/ResizableSplitView.svelte";
  import { getTypeDisplay } from "../../../typescript/helpers";
  import type { Package as PackageType } from "@s4tk/models";

  const { Package } = window.S4TK.models;
  const { Buffer } = window.S4TK.Node;
  const { formatResourceInstance } = window.S4TK.formatting;

  export let params: {
    server: string;
    message: string;
    filename: string;
  };

  let splitview: any;
  let pkg: PackageType;
  let selectedIndex = 0;

  $: entry = pkg?.get(selectedIndex);

  onMount(async () => {
    navbarTitleType.set("file");

    const res = await fetch(
      `http://localhost:3000/discord/${params.server}/${params.message}/${params.filename}`
    );

    if (res.ok) {
      const buffer = await res.arrayBuffer();
      pkg = await Package.fromAsync(Buffer.from(buffer), {
        saveBuffer: true,
      });
    } else {
      console.error("Ahhhh");
    }
  });

  $: {
    if (entry?.key) {
      navbarTextStore.set(
        `${getTypeDisplay(
          entry?.key.type,
          entry?.key.group
        )}, ${formatResourceInstance(entry?.key.instance)}`
      );
    }
  }

  function collapseFileExplorer() {
    splitview.collapseLeftPanel();
  }
</script>

<svelte:head>
  <title>{params.filename}</title>
</svelte:head>

<section id="viewer-section">
  {#if pkg != undefined}
    <ResizableSplitView leftPanelName="File Explorer" bind:this={splitview}>
      <EntriesMenu
        slot="left"
        onClose={collapseFileExplorer}
        bind:selectedIndex
        {pkg}
      />
      <PrismWrapper slot="right" {entry} />
    </ResizableSplitView>
  {/if}
</section>

<style lang="scss">
  // intentionally blank
</style>
