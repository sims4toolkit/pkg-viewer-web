<script lang="ts">
  import { onMount } from "svelte";
  import type { Package as PackageType } from "@s4tk/models";
  import config from "../../../config";
  import PkgViewer from "./PkgViewer.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";

  const { Package } = window.S4TK.models;
  const { Buffer } = window.S4TK.Node;

  export let params: {
    server: string;
    message: string;
    filename: string;
  };

  let pkg: PackageType;
  let error = "";
  let errorStatus: number;

  $: errorStatusDollars = errorStatus
    ? `$${(errorStatus / 100).toFixed(2)}`
    : "";

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
          errorStatus = res.status;
          error = await res.text();
        }
      })
      .catch((err) => {
        console.error(err);
        errorStatus = 404;
        error = "No valid package was found.";
      });
  });
</script>

<section id="discord-pkg-viewer" class:flex-center-v={!pkg}>
  {#if pkg != undefined && pkg.size > 0}
    <PkgViewer {pkg} pkgName={params.filename} />
  {:else}
    <ContentArea>
      {#if error}
        <SectionHeader title="Unlock this page for {errorStatusDollars}" />
        <p class="my-2">Just kidding. An error occurred.</p>
        <p class="my-0 subtle-text">Error {errorStatus}: {error}</p>
      {:else}
        <h3 class="subtle-color text-center">Loading...</h3>
      {/if}
    </ContentArea>
  {/if}
</section>

<style lang="scss">
  #discord-pkg-viewer {
    height: 100vh;
  }
</style>
