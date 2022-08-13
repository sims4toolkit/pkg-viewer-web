<script lang="ts">
  import Checkbox from "../../shared/Checkbox.svelte";
  import IconButton from "../../shared/IconButton.svelte";
  import Select from "../../shared/Select.svelte";
  import TextInput from "../../shared/TextInput.svelte";
  import AddOnManualKey from "./AddOnManualKey.svelte";
  import AddOnSimData from "./AddOnSimData.svelte";
  import AddOnTemplateId from "./AddOnTemplateId.svelte";
  import type {
    GeneratedFileEntryData,
    GeneratedFilesData,
    GlobalSettings,
  } from "./types";
  const { fnv32, fnv64 } = window.S4TK.hashing;
  const { TuningResourceType } = window.S4TK.enums;

  export let globalSettings: GlobalSettings;
  export let fileData: GeneratedFilesData;
  export let entry: GeneratedFileEntryData;

  let hasManualKey = entry.manualKey != undefined;
  let useCustomTemplate = entry.templateId !== 0;

  const typeOptions = [
    ...TuningResourceType.all().map((type) => {
      return {
        value: type,
        text: TuningResourceType[type],
      };
    }),
  ];

  $: {
    if (hasManualKey) {
      entry.manualKey = {
        type: entry.type,
        group: 0,
        instance: BigInt(
          (entry.use32bit ? fnv32 : fnv64)(
            globalSettings.filenamePrefix + entry.filename,
            entry.useHighBit
          )
        ),
      };
    } else {
      delete entry.manualKey;
    }
  }

  $: {
    if (!useCustomTemplate) {
      entry.templateId = 0;
    }
  }

  function deleteEntry() {
    const index = fileData.entries.findIndex((e) => e === entry);
    if (index >= 0) {
      fileData.entries.splice(index, 1);
      fileData = fileData;
    }
  }

  function duplicateEntry() {
    const newEntry: Partial<GeneratedFileEntryData> = {};
    for (const key in entry) newEntry[key] = entry[key];
    newEntry.id = fileData.nextId++;
    newEntry.filename = "";
    delete newEntry.manualKey;
    fileData.entries.push(newEntry as GeneratedFileEntryData);
    fileData = fileData;
  }
</script>

<div class="w-100">
  <div
    class="primary-entry p-half flex flex-gap flex-center-v flex-wrap w-100"
    class:has-simdata={entry.hasSimData}
  >
    <TextInput
      name={`gen-file-name-${entry.id}`}
      bind:value={entry.filename}
      placeholder="File name (excluding prefix)"
      focusOnMount={true}
      fillWidth={true}
    />
    <Select
      name={`gen-file-type-${entry.id}`}
      bind:selected={entry.type}
      options={typeOptions}
      disabled={hasManualKey}
    />
    <div class="flex-col flex-gap-small">
      <Checkbox
        label="32-bit"
        bind:checked={entry.use32bit}
        disabled={hasManualKey}
      />
      <Checkbox
        label="High bit"
        bind:checked={entry.useHighBit}
        disabled={hasManualKey}
      />
    </div>
    <div class="flex-col flex-gap-small">
      <Checkbox label="Manual key" bind:checked={hasManualKey} />
      <Checkbox label="SimData" bind:checked={entry.hasSimData} />
    </div>
    <div class="flex-col flex-gap-small">
      <Checkbox label="Template" bind:checked={useCustomTemplate} />
    </div>
    <div class="flex flex-gap-small">
      <IconButton
        title="Duplicate"
        icon="duplicate"
        noBorder={true}
        onClick={duplicateEntry}
        round={false}
      />
      <IconButton
        title="Delete"
        icon="trash"
        noBorder={true}
        onClick={deleteEntry}
        danger={true}
        round={false}
      />
    </div>
  </div>
  {#if entry.manualKey}
    <div class="linked-entry">
      <AddOnManualKey bind:entry />
    </div>
  {/if}
  {#if useCustomTemplate}
    <div class="linked-entry">
      <AddOnTemplateId bind:globalSettings bind:entry />
    </div>
  {/if}
  {#if entry.hasSimData}
    <div class="linked-entry">
      <AddOnSimData bind:entry />
    </div>
  {/if}
</div>

<style lang="scss">
  .primary-entry {
    background-color: var(--color-bg-secondary);
    border-radius: 4px;

    &.has-simdata {
      border-radius: 4px 4px 0 4px;
    }
  }

  .linked-entry {
    background-color: var(--color-bg-secondary);
    border-radius: 0;
    border-top: 1px solid var(--color-bg);
    padding: 0.5em;
    margin-left: 2em;

    &:last-child {
      border-radius: 0 0 4px 4px;
    }
  }
</style>
