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
    GeneratedFileData,
    GlobalSettings,
    XmlFileTemplateData,
  } from "./types";
  import defaultTemplateData from "../../../data/default-templates.json";
  const { TuningResourceType } = window.S4TK.enums;

  let globalSettings: GlobalSettings = {
    filenamePrefix: "",
    all32bit: false,
    allHighBit: false,
  };

  let fileData: GeneratedFileData[] = [];
  let nextEntryId = 0;
  let editingTemplates = false;
  let templateData: XmlFileTemplateData = defaultTemplateData;

  const defaultType = TuningResourceType.all()[0];
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
    fileData.push({
      id: nextEntryId++,
      filename: "",
      hasSimData: false,
      type: defaultType,
      use32bit: globalSettings.all32bit,
      useHighBit: globalSettings.allHighBit,
    });

    fileData = fileData;
  }

  function copyLastResource() {
    if (fileData.length === 0) return addResource();
    const entry: Partial<GeneratedFileData> = {};
    const lastEntry = fileData[fileData.length - 1];
    for (const key in lastEntry) entry[key] = lastEntry[key];
    entry.id = nextEntryId++;
    entry.filename = "";
    delete entry.manualKey;
    fileData.push(entry as GeneratedFileData);
    fileData = fileData;
  }

  // addResource(); // FIXME: temp
</script>

<svelte:head>
  <title>Package Generator</title>
</svelte:head>

<section id="discord-pkg-viewer" class="flex-col">
  <ContentArea banded={true} bottomShadow={true}>
    <SectionHeader title="Package Generator" />
    <p>
      This tool generates tuning/SimData files in a package, so you do not need
      to manually create them with S4S. All files will be created with
      bare-bones XML only (including their name and tuning ID) unless you use
      custom templates. This is an <span class="bold underline error-color"
        >experimental, incomplete, and temporary</span
      >
      tool while the actual S4TK tuning/SimData generator is being developed - its
      output will likely need some manual polishing.
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
    {#if fileData?.length > 0}
      <div class="flex-col-reverse flex-gap">
        {#each fileData as entry (entry.id)}
          <GeneratedFileEntry bind:fileData bind:globalSettings bind:entry />
        {/each}
      </div>
    {:else}
      <div class="flex-center0h">
        <h2 class="subtle-color text-center">This package is empty</h2>
        <p class="subtle-color text-center">
          Add an entry by clicking the <InlineImage src="plus" /> button, or by pressing
          <mark class="key">ctrl/command</mark>
          +
          <mark class="key">n</mark>.
        </p>
        <p class="subtle-color text-center">
          The most recent entry can be cloned with the <InlineImage
            src="copy"
          /> button, or by pressing <mark class="key">ctrl/command</mark>
          +
          <mark class="key">m</mark>.
        </p>
      </div>
    {/if}
  </ContentArea>
</section>
<div class="new-resource-btn flex flex-gap-small">
  <IconButton
    icon="copy"
    small={true}
    noBorder={false}
    title="Duplicate Last"
    onClick={copyLastResource}
    useBg={true}
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
    <TemplatesEditor bind:templateData />
  </BlurOverlay>
{/if}

<style lang="scss">
  .new-resource-btn {
    position: fixed;
    bottom: 25px;
    right: 25px;
  }
</style>
