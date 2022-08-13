<script lang="ts">
  import Checkbox from "../../shared/Checkbox.svelte";
  import Select from "../../shared/Select.svelte";
  import TextInput from "../../shared/TextInput.svelte";
  import AddOnManualKey from "./AddOnManualKey.svelte";
  import AddOnSimData from "./AddOnSimData.svelte";
  import type { GeneratedFileData, GlobalSettings } from "./types";
  const { TuningResourceType } = window.S4TK.enums;

  export let globalSettings: GlobalSettings;
  export let entry: GeneratedFileData;

  const typeOptions = [
    ...TuningResourceType.all().map((type) => {
      return {
        value: type,
        text: TuningResourceType[type],
      };
    }),
  ];
</script>

<div class="w-100">
  <div
    class="primary-entry p-half flex flex-gap flex-center-v"
    class:has-simdata={entry.hasSimData}
  >
    <TextInput
      name={`gen-file-name-${entry.id}`}
      bind:value={entry.filename}
      placeholder="File name (excluding prefix)"
      fillWidth={true}
      focusOnMount={true}
    />
    <Select
      name={`gen-file-type-${entry.id}`}
      bind:selected={entry.type}
      options={typeOptions}
    />
    <div class="flex-col flex-gap-small">
      <Checkbox label="32-bit" bind:checked={entry.use32bit} />
      <Checkbox label="High bit" bind:checked={entry.useHighBit} />
    </div>
  </div>
  {#if entry.manualKey}
    <div class="linked-entry">
      <AddOnManualKey bind:entry bind:globalSettings />
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
