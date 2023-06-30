<script lang="ts">
  import { onDestroy } from "svelte";
  import { subscribeToKey } from "../../../typescript/keybindings";
  import Footer from "../../Footer.svelte";
  import BlurOverlay from "../../layout/BlurOverlay.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";
  import Button from "../../shared/Button.svelte";
  import Checkbox from "../../shared/Checkbox.svelte";
  import IconButton from "../../shared/IconButton.svelte";
  import InlineImage from "../../shared/InlineImage.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";
  import TextInput from "../../shared/TextInput.svelte";
  import GeneratedFileEntry from "./GeneratedFileEntry.svelte";
  import TemplatesEditor from "./TemplatesEditor.svelte";
  import type {
    GeneratedFileEntryData,
    GeneratedFilesData,
    GlobalSettings,
  } from "./types";
  const { enums } = window.S4TK;

  export let globalSettings: GlobalSettings;
  export let fileData: GeneratedFilesData;

  let editingTemplates = false;

  const defaultType = enums.TuningResourceType.all()[0];
  const keySubscriptions = [
    subscribeToKey("n", addResource, {
      ctrlOrMeta: true,
      preventDefault: true,
    }),
    subscribeToKey("m", copyLastResource, {
      ctrlOrMeta: true,
      preventDefault: true,
    }),
  ];

  onDestroy(() => {
    keySubscriptions.forEach((unsub) => unsub());
  });

  function addResource() {
    fileData.entries.push({
      id: fileData.nextId++,
      filename: "",
      hasSimData: false,
      type: defaultType,
      use32bit: globalSettings.all32bit,
      useHighBit: globalSettings.allHighBit,
      templateId: 0,
    });

    fileData = fileData;
  }

  function copyLastResource() {
    if (fileData.entries.length === 0) return;
    const entry: Partial<GeneratedFileEntry> = {};
    const lastEntry = fileData.entries[fileData.entries.length - 1];
    for (const key in lastEntry) entry[key] = lastEntry[key];
    entry.id = fileData.nextId++;
    entry.filename = "";
    delete entry.manualKey;
    fileData.entries.push(entry as GeneratedFileEntryData);
    fileData = fileData;
  }

  function deleteAllResources() {
    if (
      confirm(
        "This will delete all of the entries you've made for this package. This cannot be undone. Are you sure you want to continue?"
      )
    ) {
      fileData.entries.splice(0, fileData.entries.length);
      fileData = fileData;
    }
  }
</script>

<svelte:head>
  <title>Package Generator</title>
</svelte:head>

<section id="pkg-builder-viewer" class="flex-col">
  <ContentArea banded={true} bottomShadow={true}>
    <SectionHeader title="Tuning Generator" />
    <p>
      This tool generates tuning/SimData files in a package, so you do not need
      to manually create them. All files are created with bare-bones XML only
      (including their name and tuning ID) unless you use custom templates. This
      is an <span class="bold underline error-color"
        >experimental, incomplete, and temporary</span
      >
      tool, and will be retired in the near future, as proper file generation will
      be handled by the
      <a href="https://vscode.sims4toolkit.com/" target="_blank"
        >S4TK VS Code extension</a
      >, and I doubt anyone uses this one anyways.
    </p>
    <p class="subtle-text">
      If you do use it and would like to see it preserved, <a
        href="https://frankkmods.com/#/contact"
        target="_blank">let me know</a
      >, or I'll just yeet it into the void.
    </p>
    <div class="mt-2">
      <p class="small-title mb-half mt-0">Global settings</p>
      <div class="flex-center-v flex-gap flex-wrap">
        <TextInput
          name="filename-prefix-input"
          placeholder="Prefix file names with..."
          bind:value={globalSettings.filenamePrefix}
          fillWidth={true}
        />
        <Checkbox
          label="32-bit by default"
          bind:checked={globalSettings.all32bit}
        />
        <Checkbox
          label="High bit by default"
          bind:checked={globalSettings.allHighBit}
        />
        <Button
          text="Edit Templates"
          onClick={() => (editingTemplates = true)}
        />
      </div>
    </div>
  </ContentArea>
  <ContentArea>
    {#if fileData?.entries.length > 0}
      <div class="flex-col-reverse flex-gap">
        {#each fileData.entries as entry (entry.id)}
          <GeneratedFileEntry bind:fileData bind:globalSettings bind:entry />
        {/each}
      </div>
    {:else}
      <div class="flex-center0h">
        <h2 class="text-center text-shadow">This package is empty</h2>
        <p class="subtle-color text-center">
          Add an entry with the <InlineImage src="plus" /> button or
          <mark class="key">ctrl/cmd</mark>
          +
          <mark class="key">n</mark>.
        </p>
        <p class="subtle-color text-center">
          Clone the last entry with the <InlineImage src="duplicate" /> button or
          <mark class="key">ctrl/cmd</mark>
          +
          <mark class="key">m</mark>.
        </p>
        <p class="subtle-color text-center">
          Build the package with the <span class="monospace small-text"
            ><InlineImage src="hammer" />Build</span
          >
          button or <mark class="key">ctrl/cmd</mark>
          +
          <mark class="key">b</mark>.
        </p>
      </div>
    {/if}
  </ContentArea>
</section>
<div class="new-resource-btn flex flex-gap-small">
  <IconButton
    icon="trash"
    title="Delete All"
    onClick={deleteAllResources}
    danger={true}
    useBg={true}
    active={fileData.entries.length > 0}
  />
  <IconButton
    icon="duplicate"
    title="Duplicate Last"
    onClick={copyLastResource}
    useBg={true}
    active={fileData.entries.length > 0}
  />
  <IconButton
    icon="plus"
    title="New Resource"
    onClick={addResource}
    useBg={true}
  />
</div>
<Footer />

{#if editingTemplates}
  <BlurOverlay onClose={() => (editingTemplates = false)}>
    <TemplatesEditor bind:globalSettings />
  </BlurOverlay>
{/if}

<style lang="scss">
  .new-resource-btn {
    position: fixed;
    bottom: 25px;
    right: 25px;
  }
</style>
