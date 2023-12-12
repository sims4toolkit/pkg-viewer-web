<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { saveAs } from "file-saver";
  import type { EditorView } from "codemirror";
  import CodemirrorEditor from "lib/editor/editor";
  import Settings, { SettingsSubscriptionManager } from "lib/utils/settings";
  import { get } from "svelte/store";
  const { XmlDocumentNode } = window.S4TK.xml;

  export let filename: string;
  export let content: string;
  export let extension: string;

  let editor: EditorView;
  let editorElement: HTMLDivElement;
  let isXmlFormatted = false;

  $: canFormatXml = !isXmlFormatted && extension === "xml";

  const subscriptions = [
    SettingsSubscriptionManager.subscribe("isLightTheme", (isLightTheme) => {
      if (editor) CodemirrorEditor.updateTheme(editor, !isLightTheme);
    }),
  ];

  onMount(() => {
    editor = CodemirrorEditor.create(
      editorElement,
      !Settings.isLightTheme,
      getSyntaxCode()
    );

    CodemirrorEditor.updateContent(editor, content, getSyntaxCode(), true);
  });

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  function getSyntaxCode(): "xml" | "json" | "py" | "js" {
    switch (extension) {
      case "xml":
      case "json":
      case "py":
        return extension;
      case "js":
      case "cjs":
      case "ts":
        return "js";
      default:
        return "py"; // HACK: python just looks the best for plain text...
    }
  }

  function getLanguageName(): string {
    switch (extension) {
      case "py":
        return "python";
      case "js":
      case "cjs":
        return "javascript";
      case "ts":
        return "typescript";
      default:
        return extension;
    }
  }

  function downloadFile() {
    saveAs(new Blob([content]), filename);
  }

  function formatXml() {
    try {
      const doc = XmlDocumentNode.from(content);
      const formattedContent = doc.toXml({
        spacesPerIndent: Settings.formatXmlSpaces,
      });
      CodemirrorEditor.updateContent(editor, formattedContent, "xml");
      isXmlFormatted = true;
    } catch (e) {
      console.error(e);
    }
  }
</script>

<svelte:head>
  <title>{filename}</title>
</svelte:head>

<section class="pt-10 h-screen w-screen">
  <div
    bind:this={editorElement}
    class="absolute top-10 bottom-10 left-0 right-0 overflow-auto"
  />
  <div
    class="absolute bottom-0 left-0 right-0 h-10 px-2 bg-gray-200 dark:bg-gray-900 flex items-center justify-between border-t border-solid border-t-gray-300 dark:border-t-gray-700"
  >
    <div class="flex gap-2">
      <button
        on:click={downloadFile}
        class="download-button text-xs px-2 py-1 rounded border border-solid border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
        ><img
          src="./assets/icons/download.svg"
          alt="download"
          class="svg h-4 w-4 inline"
        />
        Download</button
      >
      {#if canFormatXml}
        <button
          on:click={formatXml}
          class="download-button text-xs px-2 py-1 rounded border border-solid border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
          ><img
            src="./assets/icons/code-slash-outline.svg"
            alt="code"
            class="svg h-4 w-4 inline"
          />
          Format</button
        >
      {/if}
    </div>
    <p class="text-subtle text-xs uppercase">{getLanguageName()}</p>
  </div>
</section>

<style lang="scss">
  .download-button:hover img {
    filter: var(--filter-svg-invert);
  }
</style>
