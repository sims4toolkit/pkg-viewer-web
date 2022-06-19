<script lang="ts">
  import { onMount } from "svelte";
  import { navbarTextStore, navbarTitleType } from "../../../typescript/stores";
  import PrismWrapper from "../../layout/PrismWrapper.svelte";
  import EntriesMenu from "./EntriesMenu.svelte";
  import ResizableSplitView from "../../layout/ResizableSplitView.svelte";
  import {
    getTypeDisplay,
    scanPackageForWarnings,
  } from "../../../typescript/helpers";
  import type { Package as PackageType } from "@s4tk/models";
  import MovableWindow from "../../layout/MovableWindow.svelte";

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
  let warnings: Map<number, string[]>;
  let numWarnings = 0;
  let selectedIndex = 0;
  let error = false;
  let showWarnings = false;
  let allWarnings: string[];

  $: entry = pkg?.get(selectedIndex);

  $: {
    numWarnings = 0;
    allWarnings = [];
    warnings?.forEach((entryWarnings) => {
      numWarnings += entryWarnings.length;
      allWarnings.push(...entryWarnings);
    });
  }

  onMount(async () => {
    navbarTitleType.set("file");

    // FIXME: temporary
    // const res = await fetch(
    //   `http://localhost:3000/discord/${params.server}/${params.message}/${params.filename}`
    // );
    error = true;
    return;

    // if (res.ok) {
    //   try {
    //     const buffer = await res.arrayBuffer();
    //     pkg = await Package.fromAsync(Buffer.from(buffer), {
    //       saveBuffer: true,
    //     });
    //     warnings = scanPackageForWarnings(pkg);
    //   } catch (err) {
    //     console.error(err);
    //     navbarTextStore.set("No Package Found");
    //     error = true;
    //   }
    // } else {
    //   navbarTextStore.set("No Package Found");
    //   error = true;
    // }
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
        {warnings}
      />
      <PrismWrapper slot="right" {entry} />
    </ResizableSplitView>
  {:else if error}
    <div class="error-display flex-center">
      <h3>No package was found at the provided address.</h3>
    </div>
  {/if}
</section>

{#if showWarnings}
  <MovableWindow title="Warnings" onClose={() => (showWarnings = false)}>
    <div>
      {#if warnings.get(selectedIndex)?.length > 0}
        <p class="small-title my-0">
          current file ({warnings.get(selectedIndex)?.length})
        </p>
        {#each warnings.get(selectedIndex) as warning, key (key)}
          <div class="flex flex-gap-small mt-half">
            <img
              src="./assets/warning-outline.svg"
              class="is-svg warning-svg text-height"
              alt="Warning"
            />
            <p class="my-0">{warning}</p>
          </div>
        {/each}
      {:else}
        <p class="small-title mb-0">no warnings in current file</p>
      {/if}
      <hr class="my-1" />
      <p class="small-title my-0">
        all files ({numWarnings})
      </p>
      {#each allWarnings as warning, key (key)}
        <div class="flex flex-gap-small mt-half">
          <img
            src="./assets/warning-outline.svg"
            class="is-svg warning-svg text-height"
            alt="Warning"
          />
          <p class="my-0">{warning}</p>
        </div>
      {/each}
    </div>
  </MovableWindow>
{:else if numWarnings > 0}
  <button
    id="warning-button"
    class="button-wrapper drop-shadow"
    on:click={() => (showWarnings = true)}
  >
    <div class="flex-center-v flex-gap-small my-half mx-1">
      <img
        src="./assets/warning-outline.svg"
        class="is-svg warning-svg"
        alt="Warning"
      />
      <p class="my-0 nowrap">
        {numWarnings}
        {numWarnings === 1 ? "warning!" : "warnings!"}
      </p>
    </div>
  </button>
{/if}

<style lang="scss">
  .error-display {
    height: 85vh;
    width: 100%;

    h3 {
      color: var(--color-text-subtle);
    }
  }

  #warning-button {
    position: fixed;
    right: 20px;
    bottom: 20px;
    background-color: var(--color-bg-secondary);
    border-radius: 4px;

    img {
      height: 1.2em;
      width: auto;
    }
  }
</style>
