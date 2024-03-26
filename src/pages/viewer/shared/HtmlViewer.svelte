<script lang="ts">
  import { onMount } from "svelte";
  import SectionHeader from "components/elements/SectionHeader.svelte";
  import LoadingIndicator from "components/elements/LoadingIndicator.svelte";
  const { fnv64 } = window.S4TK.hashing;

  export let content: string;

  let pseudoElement: HTMLElement;
  let scripts: HTMLCollectionOf<HTMLScriptElement>;
  let scriptPreviewText: string;

  onMount(() => {
    pseudoElement = document.createElement("html");
    pseudoElement.innerHTML = content;

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

  function replaceSiteHtml(innerHtml: string) {
    document.open();
    document.write(innerHtml);
    document.close();
  }

  function loadWithScript() {
    replaceSiteHtml(content);
  }

  function loadContentOnly() {
    for (let i = 0; i < scripts.length; ++i) scripts[i].remove();
    replaceSiteHtml(pseudoElement.innerHTML);
  }

  function verifyIntegrity(script: string) {
    return new Set([
      481680305281281086n, // BE
      5752791050115035947n, // BE UI
      10458745370689969317n, // MCCC
    ]).has(fnv64(script.trim()));
  }
</script>

<section class="pt-10 px-4 h-screen w-screen flex items-center justify-center">
  {#if scriptPreviewText}
    <div class="max-w-screen-md">
      <div class="max-w-full">
        <SectionHeader title="Do you trust this page?" />
        <p class="mt-4 mb-8">
          The HTML page you're about to preview contains an unrecognized script.
          Running scripts from people you do not know can be risky; review it
          below before proceeding. Loading without the script make cause the
          page to behave incorrectly.
        </p>
        <div class="flex gap-4">
          <button
            class="px-3 py-2 rounded border border-solid border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
            on:click={loadContentOnly}>Load Content Only</button
          >
          <button
            class="px-3 py-2 rounded border border-solid border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
            on:click={loadWithScript}>Load with Script</button
          >
        </div>
      </div>
      <div
        class="max-w-full mt-8 w-full max-h-52 overflow-auto bg-gray-200 dark:bg-gray-900 rounded-lg"
      >
        <pre
          class="w-full p-2 whitespace-pre-wrap break-all">{scriptPreviewText}</pre>
      </div>
    </div>
  {:else}
    <LoadingIndicator />
  {/if}
</section>
