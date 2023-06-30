<script lang="ts">
  import type { DdsImageResource } from "@s4tk/models";
  import PrismWrapper from "../../layout/PrismWrapper.svelte";
  const { EncodingType } = window.S4TK.enums;

  export let pkgHasInstance: (instance: bigint) => boolean;
  export let goToFile: (instance: bigint) => void;
  export let entry = null;
  export let language = "xml";
  export let source = "";

  let displayType: "code" | "image" = "code";
  let showContent = true;
  let imageSrc: string;
  let imageWidth: number;
  let imageHeight: number;
  let showGoToFileButton = false;
  let goToFileButton: HTMLButtonElement;
  let goToFileAction: () => void;

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
        return await setImageSrc();
      case EncodingType.Null:
        displayType = "code";
        language = "none";
        return (source = "This record has no content.");
      default:
        if (entry.value.isXml()) {
          displayType = "code";
          language = "xml";
          return (source = entry.value.buffer.toString());
        } else {
          displayType = "code";
          language = "none";
          return (source = entry.value.getBuffer().toString());
        }
    }
  }

  async function setImageSrc() {
    try {
      displayType = "image";
      const image = (entry.value as DdsImageResource).image;
      const jimpImage = image.toJimp();
      imageWidth = jimpImage.getWidth();
      imageHeight = jimpImage.getHeight();
      const buffer = await jimpImage.getBufferAsync("image/png");
      imageSrc = "data:image/png;base64," + buffer.toString("base64");
    } catch (e) {
      console.error(e);
      displayType = "code";
      language = "none";
      source = "Error: Could not parse DDS image.";
    }
  }

  function getSelectionText() {
    var text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
      //@ts-ignore
    } else if (document.selection && document.selection.type != "Control") {
      //@ts-ignore
      text = document.selection.createRange().text;
    }
    return text;
  }

  function parseBigInt(text: string, forceHex = false): bigint {
    try {
      return BigInt(forceHex ? "0x" + text : text);
    } catch (e) {
      return forceHex ? null : parseBigInt(text, true);
    }
  }

  function handleMouseUp(e: MouseEvent) {
    try {
      const text = getSelectionText();
      const instance = parseBigInt(text);
      if (instance && pkgHasInstance(instance)) {
        showGoToFileButton = true;
        goToFileButton.style.left = e.pageX + "px";
        goToFileButton.style.top = e.pageY + 15 + "px";
        goToFileAction = () => {
          showGoToFileButton = false;
          goToFile(instance);
        };
      } else {
        showGoToFileButton = false;
      }
    } catch (_) {
      showGoToFileButton = false;
    }
  }
</script>

<div
  class="prism-wrapper"
  class:flex-center={displayType !== "code"}
  on:mouseup={handleMouseUp}
>
  {#if showContent}
    {#if displayType === "code"}
      <PrismWrapper {language} {source} />
    {:else if displayType === "image"}
      {#if imageSrc}
        <div class="flex-center-h flex-col flex-gap-small">
          <img src={imageSrc} alt="DDS Preview" />
          <p class="my-0 subtle-text text-center">
            {imageWidth} x {imageHeight}
          </p>
        </div>
      {/if}
    {/if}
  {/if}
</div>

<button
  id="go-to-file-button"
  hidden={!showGoToFileButton}
  bind:this={goToFileButton}
  on:click={goToFileAction}>Go to File</button
>

<style lang="scss">
  .prism-wrapper {
    max-width: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: auto;

    img {
      border: 1px solid var(--color-text);
      max-width: 256px;
      max-height: 256px;
    }
  }

  button#go-to-file-button {
    position: fixed;
    z-index: 5000;
    background: none;
    border: 1px solid var(--color-bg-secondary);
    background-color: var(--color-card-secondary);
    border-radius: 4px;
    padding: 0.25em;
    color: var(--color-text);

    &:hover {
      cursor: pointer;
      background-color: var(--color-bg-secondary);
    }
  }
</style>
