<script lang="ts">
  import { onMount } from "svelte";
  import config from "../../../config";
  import ContentArea from "../../layout/ContentArea.svelte";
  import PrismWrapper from "../../layout/PrismWrapper.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";
  import HtmlReplacementView from "./HtmlReplacementView.svelte";

  const { Buffer } = window.S4TK.Node;

  export let extension: string;
  export let params: {
    server: string;
    message: string;
    filename: string;
  };

  let fileContent: string;
  let error: string;
  let errorStatus: number;
  let htmlContent: string;

  $: language = extension && getLanguageCode();

  $: errorStatusDollars = errorStatus
    ? `$${(errorStatus / 100).toFixed(2)}`
    : "";

  function getLanguageCode() {
    switch (extension) {
      case "xml":
      case "py":
      case "json":
      case "js":
      case "ts":
        return extension;
      case "cjs":
        return "js";
      default:
        return "none";
    }
  }

  onMount(async () => {
    fetch(
      `${config.API_BASE}/discord/${params.server}/${params.message}/${params.filename}`
    )
      .then(async (res) => {
        if (res.ok) {
          const arrBuff = await res.arrayBuffer();
          const buffer = Buffer.from(arrBuff);
          const content = buffer.toString();

          if (extension !== "html") {
            fileContent = content;
          } else {
            htmlContent = content;
          }
        } else {
          errorStatus = res.status;
          error = await res.text();
        }
      })
      .catch((err) => {
        console.error(err);
        errorStatus = 404;
        error = "No file was found at the provided address.";
      });
  });
</script>

<section
  id="discord-plaintext-viewer"
  class:flex-center-v={!(fileContent || htmlContent)}
>
  {#if fileContent}
    <PrismWrapper {language} source={fileContent} />
  {:else if htmlContent}
    <HtmlReplacementView {htmlContent} />
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
  #discord-plaintext-viewer {
    height: 100vh;
  }
</style>
