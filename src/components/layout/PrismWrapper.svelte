<script>
  const { EncodingType } = window.S4TK.enums;

  // this only exists because svelte-prism doesn't play nice with TS
  import Prism from "svelte-prism";
  export let entry;

  let language = "xml";
  let content = "";
  let showContent = true;

  $: {
    if (entry != undefined) {
      content = getContent();
      showContent = false;
      setTimeout(() => {
        showContent = true;
      }, 100);
    }
  }

  function getContent() {
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
        language = "xml";
        return entry.value.getBuffer().toString();
    }
  }
</script>

<div class="prism-wrapper">
  {#if showContent}
    <Prism {language}>
      {content}
    </Prism>
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
