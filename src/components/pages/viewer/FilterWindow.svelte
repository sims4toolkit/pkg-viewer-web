<script lang="ts">
  import MovableWindow from "../../layout/MovableWindow.svelte";
  import TextInput from "../../shared/TextInput.svelte";
  import Select from "../../shared/Select.svelte";
  import { StringTableLocale } from "@s4tk/models/enums";
  import Checkbox from "../../shared/Checkbox.svelte";
  import type { EntryFilterSettings } from "../../../global";

  const { BinaryResourceType, TuningResourceType, SimDataGroup } =
    window.S4TK.enums;

  export let onClose: () => void;
  export let filterSettings: EntryFilterSettings;

  $: {
    if (filterSettings.fileType === BinaryResourceType.StringTable) {
      filterSettings.showNonEnStbls = true;
    }
  }

  let typeOptions: { value: number; text: string }[] = [
    { value: 0, text: "All" },
    ...BinaryResourceType.all().map((type) => {
      return {
        value: type as number,
        text: BinaryResourceType[type],
      };
    }),
    ...TuningResourceType.all().map((type) => {
      return {
        value: type as number,
        text: TuningResourceType[type],
      };
    }),
  ].sort((a, b) => {
    if (b.value === 0 || a.text > b.text) return 1;
    if (a.text < b.text) return -1;
    return 0;
  });

  let simdataGroupOptions: { value: number; text: string }[] = [
    { value: 0, text: "All" },
    ...SimDataGroup.all().map((type) => {
      return {
        value: type as number,
        text: SimDataGroup[type],
      };
    }),
  ];

  let localeOptions: { value: number; text: string }[] = [
    { value: null, text: "All" },
    ...StringTableLocale.all().map((type) => {
      return {
        value: type as number,
        text: StringTableLocale[type],
      };
    }),
  ].sort((a, b) => {
    if (b.value === null || a.text > b.text) return 1;
    if (a.text < b.text) return -1;
    return 0;
  });
</script>

<MovableWindow title="Filter" {onClose}>
  <div>
    <Checkbox
      bind:checked={filterSettings.showUnsupported}
      label="Show unsupported files"
    />
    <br />
    <Checkbox
      bind:checked={filterSettings.showNonEnStbls}
      label="Show non-English STBLs"
    />
    <br />
    <Select
      label="file type"
      name="resource-type-filter"
      bind:selected={filterSettings.fileType}
      options={typeOptions}
      fillWidth={true}
    />
    <br />
    {#if filterSettings.fileType === BinaryResourceType.SimData}
      <Select
        label="simdata group"
        name="simdata-group-filter"
        bind:selected={filterSettings.simDataGroup}
        options={simdataGroupOptions}
        fillWidth={true}
      />
      <br />
    {/if}
    {#if filterSettings.fileType === BinaryResourceType.StringTable}
      <Select
        label="stbl locale"
        name="stbl-locale-filter"
        bind:selected={filterSettings.stblLocale}
        options={localeOptions}
        fillWidth={true}
      />
    {:else}
      <TextInput
        label="filename substring"
        name="filename-filter"
        placeholder="Filename"
        bind:value={filterSettings.filename}
        fillWidth={true}
      />
    {/if}
    <br />
    <TextInput
      label="hex instance substring"
      name="instance-filter"
      placeholder="Instance"
      bind:value={filterSettings.instanceHex}
      fillWidth={true}
    />
  </div>
</MovableWindow>

<style lang="scss">
  // intentionally blank
</style>
