<script lang="ts">
  import Checkbox from "../../shared/Checkbox.svelte";
  import IconButton from "../../shared/IconButton.svelte";
  import Select from "../../shared/Select.svelte";
  import TextInput from "../../shared/TextInput.svelte";
  import AddOnManualKey from "./AddOnManualKey.svelte";
  import AddOnSimData from "./AddOnSimData.svelte";
  import type { GeneratedFileData, GlobalSettings } from "./types";
  const { fnv32, fnv64 } = window.S4TK.hashing;
  const { TuningResourceType } = window.S4TK.enums;

  export let globalSettings: GlobalSettings;
  export let fileData: GeneratedFileData[];
  export let entry: GeneratedFileData;

  let hasManualKey = entry.manualKey != undefined;

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

  const typeOptions = [
    ...TuningResourceType.all().map((type) => {
      return {
        value: type,
        text: TuningResourceType[type],
      };
    }),
  ];

  function deleteEntry() {
    const index = fileData.findIndex((e) => e === entry);
    if (index >= 0) {
      fileData.splice(index, 1);
      fileData = fileData;
    }
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
    <IconButton
      title="Delete"
      icon="trash"
      small={true}
      onClick={deleteEntry}
      danger={true}
      round={false}
    />
  </div>
  {#if entry.manualKey}
    <div class="linked-entry">
      <AddOnManualKey bind:entry />
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
