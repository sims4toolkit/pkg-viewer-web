<script lang="ts">
  import { onMount } from "svelte";
  import PrismWrapper from "../../layout/PrismWrapper.svelte";
  import EntriesMenu from "./EntriesMenu.svelte";
  import ResizableSplitView from "../../layout/ResizableSplitView.svelte";
  import { scanPackageForWarnings } from "../../../typescript/helpers";
  import type { Package as PackageType } from "@s4tk/models";
  import MovableWindow from "../../layout/MovableWindow.svelte";
  import config from "../../../config";

  const { Package } = window.S4TK.models;
  const { Buffer } = window.S4TK.Node;

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
  let error = "";
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
    fetch(
      `${config.API_BASE}/discord/${params.server}/${params.message}/${params.filename}`
    )
      .then(async (res) => {
        if (res.ok) {
          const buffer = await res.arrayBuffer();

          pkg = await Package.fromAsync(Buffer.from(buffer), {
            saveBuffer: true,
          });

          if (pkg.size === 0) {
            error = "This package has no entries.";
          } else {
            warnings = scanPackageForWarnings(pkg);
          }
        } else {
          error = "Package could not be fetched.";
        }
      })
      .catch((err) => {
        console.error(err);
        error = "No package was found at the provided address.";
      });
  });

  function collapseFileExplorer() {
    splitview.collapseLeftPanel();
  }
</script>

<svelte:head>
  <title>{params.filename}</title>
</svelte:head>

<section id="viewer-section">
  {#if pkg != undefined && pkg.size > 0}
    <ResizableSplitView leftPanelName="File Explorer" bind:this={splitview}>
      <EntriesMenu
        slot="left"
        onClose={collapseFileExplorer}
        onWarningClick={() => (showWarnings = true)}
        bind:selectedIndex
        {pkg}
        {warnings}
      />
      <PrismWrapper slot="right" {entry} />
    </ResizableSplitView>
  {:else if error}
    <div class="error-display flex-center">
      <h3>{error}</h3>
    </div>
  {:else}
    <div class="loading-display flex-center">
      <h3>Loading...</h3>
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
  .error-display,
  .loading-display {
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
