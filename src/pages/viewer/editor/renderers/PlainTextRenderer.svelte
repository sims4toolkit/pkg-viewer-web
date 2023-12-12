<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { EditorView } from "codemirror";
  import CodemirrorEditor from "lib/editor/editor";
  import Settings, { SettingsSubscriptionManager } from "lib/utils/settings";
  import type { PlainTextFileInfo } from "lib/viewer/viewable-file-info";
  import CornerAlert from "components/elements/CornerAlert.svelte";
  import { text } from "svelte/internal";
  const { XmlDocumentNode } = window.S4TK.xml;

  export let info: PlainTextFileInfo;

  let editor: EditorView;
  let editorElement: HTMLDivElement;
  let isXmlFormatted = false;
  let editorHasLoaded = false;
  let showFormattedConfirmation = false;
  let showCopyConfirmation = false;

  $: canFormatXml = info.language === "xml";

  $: {
    if (editor && info) updateContent();
  }

  const subscriptions = [
    SettingsSubscriptionManager.subscribe("isLightTheme", (isLightTheme) => {
      if (editor) CodemirrorEditor.updateTheme(editor, !isLightTheme);
    }),
  ];

  onMount(() => {
    editor = CodemirrorEditor.create(
      editorElement,
      !Settings.isLightTheme,
      info.language
    );
  });

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  function formatXml() {
    try {
      if (isXmlFormatted) return;
      const doc = XmlDocumentNode.from(info.textContent);
      const formattedContent = doc.toXml({
        spacesPerIndent: Settings.formatXmlSpaces,
      });
      CodemirrorEditor.updateContent(editor, formattedContent, info.language);
      isXmlFormatted = true;
      if (!showFormattedConfirmation) showFormattedConfirmation = true;
    } catch (e) {
      console.error(e);
    }
  }

  function copyToClipboard() {
    try {
      const content = editor.state.doc.toString();
      navigator.clipboard.writeText(content);
      if (!showCopyConfirmation) showCopyConfirmation = true;
    } catch (e) {
      // navigator.clipboard undefined if HTTP
      console.error(e);
    }
  }

  function updateContent() {
    CodemirrorEditor.updateContent(
      editor,
      info.textContent,
      info.language,
      !editorHasLoaded
    );

    isXmlFormatted = false;
    editorHasLoaded = true;
  }
</script>

<div
  class="absolute top-0 left-0 right-0 h-8 flex items-center justify-between px-2"
>
  <p
    class="text-xs text-subtle whitespace-nowrap text-ellipsis overflow-hidden"
  >
    {info.displayName}
  </p>
  <div class="flex items-center gap-4">
    {#if canFormatXml}
      <button
        title="Format XML"
        on:click={formatXml}
        class="tint-on-hover"
        disabled={isXmlFormatted}
        ><img
          src="./assets/icons/code-slash-outline.svg"
          alt="code"
          class="svg h-5 w-5"
        /></button
      >
    {/if}
    <button
      title="Copy to Clipboard"
      on:click={copyToClipboard}
      class="tint-on-hover"
      ><img
        src="./assets/icons/copy-outline.svg"
        alt="code"
        class="svg h-4 w-4"
      /></button
    >
  </div>
</div>
<div
  bind:this={editorElement}
  class="absolute top-8 bottom-0 left-0 right-0 overflow-auto"
/>

{#if showFormattedConfirmation}
  <CornerAlert
    text="File content formatted!"
    bind:visible={showFormattedConfirmation}
  />
{/if}
{#if showCopyConfirmation}
  <CornerAlert
    text="File content copied!"
    bind:visible={showCopyConfirmation}
  />
{/if}
