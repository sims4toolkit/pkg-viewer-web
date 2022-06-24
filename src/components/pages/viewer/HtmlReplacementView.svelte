<script lang="ts">
  import { onMount } from "svelte";
  import ContentArea from "../../layout/ContentArea.svelte";
  import PrismWrapper from "../../layout/PrismWrapper.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";

  const { fnv64 } = window.S4TK.hashing;

  export let htmlContent: string;

  let pseudoElement: HTMLElement;
  let scripts: HTMLCollectionOf<HTMLScriptElement>;
  let scriptPreviewText: string;

  function replaceSiteHtml(innerHtml: string) {
    document.open();
    document.write(innerHtml);
    document.close();
  }

  function loadWithScript() {
    replaceSiteHtml(htmlContent);
  }

  function loadContentOnly() {
    for (let i = 0; i < scripts.length; ++i) scripts[i].remove();
    replaceSiteHtml(pseudoElement.innerHTML);
  }

  function verifyIntegrity(script: string) {
    return new Set([
      481680305281281086n, // BE
      10458745370689969317n, // MCCC
    ]).has(fnv64(script.trim()));
  }

  onMount(() => {
    pseudoElement = document.createElement("html");
    pseudoElement.innerHTML = htmlContent;

    scripts = pseudoElement.getElementsByTagName("script");

    if (scripts.length) {
      const scriptsText = [];
      for (let i = 0; i < scripts.length; ++i)
        scriptsText.push(scripts[i].innerHTML);
      scriptPreviewText = scriptsText.join("\n");
      if (verifyIntegrity(scriptPreviewText)) {
        replaceSiteHtml(pseudoElement.innerHTML);
      }
    } else {
      replaceSiteHtml(pseudoElement.innerHTML);
    }
  });
</script>

<div class="html-replacement-view" class:flex-center-v={!scriptPreviewText}>
  {#if scriptPreviewText}
    <ContentArea banded={true}>
      <div>
        <SectionHeader title="Do you trust this page?" />
        <p class="my-2">
          The HTML page you're about to preview contains an unrecognized script.
          Running scripts from people you do not know can be risky, so please
          review it below before letting it run. You may also choose to preview
          the page without the script, but note that it may not function
          properly without it.
        </p>
        <button on:click={loadContentOnly}>Load Content Only</button>
        <button class="ml-2" on:click={loadWithScript}>Load with Script</button>
      </div>
    </ContentArea>
    <div class="preview-wrapper">
      <PrismWrapper language="js" source={scriptPreviewText} wrap={true} />
    </div>
  {:else}
    <ContentArea>
      <h3 class="subtle-color text-center">Loading...</h3>
    </ContentArea>
  {/if}
</div>

<style lang="scss">
  .html-replacement-view {
    max-height: 100vh;
    padding-top: 50px;
    display: flex;
    flex-direction: column;

    button {
      background-color: transparent;
      border-radius: 4px;
      padding: 1em;
      color: var(--color-accent);
      border: 1px solid var(--color-accent);

      &:hover {
        background-color: var(--color-accent);
        color: var(--color-bg);
        cursor: pointer;
      }
    }

    .preview-wrapper {
      max-width: 100%;
      overflow-x: auto;
      overflow-y: auto;
    }
  }
</style>
