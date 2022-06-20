<script lang="ts">
  import { onMount } from "svelte";
  import PrismWrapper from "../../layout/PrismWrapper.svelte";
  import EntriesMenu from "./EntriesMenu.svelte";
  import ResizableSplitView from "../../layout/ResizableSplitView.svelte";
  import type { Package as PackageType } from "@s4tk/models";
  import MovableWindow from "../../layout/MovableWindow.svelte";
  import config from "../../../config";
  import PkgViewer from "./PkgViewer.svelte";

  const { Package } = window.S4TK.models;
  const { Buffer } = window.S4TK.Node;

  export let params: {
    server: string;
    message: string;
    filename: string;
  };

  let pkg: PackageType;
  let error = "";

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
        } else {
          error = "Package could not be fetched.";
        }
      })
      .catch((err) => {
        console.error(err);
        error = "No package was found at the provided address.";
      });
  });
</script>

<svelte:head>
  <title>{params.filename}</title>
</svelte:head>

<section id="discord-pkg-viewer">
  {#if pkg != undefined && pkg.size > 0}
    <PkgViewer {pkg} />
  {:else if error}
    <div class="status-display flex-center">
      <h3>{error}</h3>
    </div>
  {:else}
    <div class="status-display flex-center">
      <h3>Loading...</h3>
    </div>
  {/if}
</section>

<style lang="scss">
  .status-display {
    height: 85vh;
    width: 100%;

    h3 {
      color: var(--color-text-subtle);
    }
  }
</style>
