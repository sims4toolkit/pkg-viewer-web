<script lang="ts">
  import PrismWrapper from "../../layout/PrismWrapper.svelte";

  const { EncodingType } = window.S4TK.enums;

  export let entry = null;
  export let language = "xml";
  export let source = "";

  let showContent = true;

  $: {
    if (entry != null) {
      source = getEntryContent();
      setTimeout(() => {
        showContent = true;
      }, 100);
    }
  }

  function getEntryContent() {
    switch (entry.value.encodingType) {
      case EncodingType.XML:
        language = "xml";
        return entry.value.content;
      case EncodingType.DATA:
        language = "xml";
        return entry.value.toXmlDocument().toXml();
      case EncodingType.STBL:
        language = "js";
        return JSON.stringify(entry.value.toJsonObject(), null, 2);
      case EncodingType.Unknown:
        if (entry.value.isXml()) {
          language = "xml";
          return entry.value.buffer.toString();
        }
      default:
        language = "none";
        return entry.value.getBuffer().toString();
    }
  }
</script>

<div class="prism-wrapper">
  {#if showContent}
    <PrismWrapper {language} {source} />
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
