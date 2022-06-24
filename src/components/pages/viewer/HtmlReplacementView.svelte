<script lang="ts">
  import { onMount } from "svelte";
  import ContentArea from "../../layout/ContentArea.svelte";
  import PrismWrapper from "../../layout/PrismWrapper.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";

  export let htmlContent: string;

  let scripts: HTMLCollectionOf<HTMLScriptElement>;
  let scriptPreviewText: string;

  function replaceSiteHtml(innerHtml: string) {
    document.open();
    document.write(innerHtml);
    document.close();
  }

  onMount(() => {
    const pseudoElement = document.createElement("html");
    pseudoElement.innerHTML = htmlContent;

    scripts = pseudoElement.getElementsByTagName("script");

    if (scripts.length) {
      const scriptsText = [];
      for (let i = 0; i < scripts.length; ++i)
        scriptsText.push(scripts[i].innerHTML);
      scriptPreviewText = scriptsText.join("\n");
    } else {
      replaceSiteHtml(pseudoElement.innerHTML);
    }
  });
</script>

<div class="html-replacement-view">
  {#if scriptPreviewText}
    <ContentArea banded={true}>
      <div>
        <SectionHeader title="Do you trust this page?" />
        <p class="my-2">
          The HTML page you're about to preview contains an unrecognized script.
          Running scripts from people you do not know can be dangerous, so
          please review it below before letting it run. You may also choose to
          preview the page without the script, but note that it may not function
          properly without it.
        </p>
        <button class="mr-2">Load with Script</button>
        <button>Load Content Only</button>
      </div>
    </ContentArea>
    <div class="preview-wrapper">
      <PrismWrapper language="js" source={scriptPreviewText} />
    </div>
  {/if}
</div>

<style lang="scss">
  .html-replacement-view {
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
  }
</style>
