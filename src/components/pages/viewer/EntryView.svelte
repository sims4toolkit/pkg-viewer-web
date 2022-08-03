<script lang="ts">
  import type { DdsImageResource } from "@s4tk/models";
  import PrismWrapper from "../../layout/PrismWrapper.svelte";
  const { EncodingType } = window.S4TK.enums;

  export let entry = null;
  export let language = "xml";
  export let source = "";

  let displayType: "code" | "image" | "none" = "code";
  let showContent = true;
  let imageElement: HTMLImageElement;
  let imageSrc: string;

  $: {
    if (entry != null) refreshEntry();
  }

  async function refreshEntry() {
    await setEntryContent();
    setTimeout(() => {
      showContent = true;
    }, 100);
  }

  async function setEntryContent() {
    switch (entry.value.encodingType) {
      case EncodingType.XML:
        displayType = "code";
        language = "xml";
        return (source = entry.value.content);
      case EncodingType.DATA:
        displayType = "code";
        language = "xml";
        return (source = entry.value.toXmlDocument().toXml());
      case EncodingType.STBL:
        displayType = "code";
        language = "js";
        return (source = JSON.stringify(entry.value.toJsonObject(), null, 2));
      case EncodingType.DDS:
        displayType = "image";
        return (imageSrc = await getImageSrc());
      default:
        if (entry.value.isXml()) {
          displayType = "code";
          language = "xml";
          return (source = entry.value.buffer.toString());
        } else {
          displayType = "none";
          language = "none";
          return (source = entry.value.getBuffer().toString());
        }
    }
  }

  async function getImageSrc(): Promise<string> {
    const buffer = await (entry.value as DdsImageResource).image
      .toJimp()
      .getBufferAsync("image/png");

    return "data:image/png;base64," + buffer.toString("base64");
  }
</script>

<div class="prism-wrapper" class:flex-center={displayType !== "code"}>
  {#if showContent}
    {#if displayType === "code"}
      <PrismWrapper {language} {source} />
    {:else if displayType === "image"}
      {#if imageSrc}
        <img bind:this={imageElement} src={imageSrc} alt="DDS Preview" />
      {/if}
    {:else}
      <p>none</p>
    {/if}
  {/if}
</div>

<style lang="scss">
  .prism-wrapper {
    max-width: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: auto;
  }
</style>
