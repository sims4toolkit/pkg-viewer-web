<script lang="ts">
  import { onMount } from "svelte";
  import type { Package } from "@s4tk/models";
  import PackageEntryRow from "./PackageEntryRow.svelte";
  import {
    getDisplayName,
    isEncodingSupported,
  } from "../../../typescript/helpers";
  import MovableWindow from "../../layout/MovableWindow.svelte";
  import TextInput from "../../shared/TextInput.svelte";
  import Select from "../../shared/Select.svelte";
  import type { ResourceKeyPair } from "@s4tk/models/types";
  import { formatResourceInstance } from "@s4tk/hashing/formatting";

  const { BinaryResourceType, TuningResourceType, SimDataGroup } =
    window.S4TK.enums;

  export let onClose: () => void;
  export let pkg: Package;
  export let selectedIndex: number;

  let showUnsupported = false;
  let showFilterWindow = false;
  let nameInputValue = "";
  let instInputValue = "";
  let filteredEntries = [];

  let selectedTypeOption = 0;
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

  let selectedSimDataGroup = 0;
  let simdataGroupOptions: { value: number; text: string }[] = [
    { value: 0, text: "All" },
    ...SimDataGroup.all().map((type) => {
      return {
        value: type as number,
        text: SimDataGroup[type],
      };
    }),
  ];

  $: supportedEntries = pkg?.entries.filter((e) =>
    isEncodingSupported(e.key.type)
  );
  $: entries = showUnsupported ? pkg?.entries : supportedEntries;
  $: numHidden = (pkg?.size ?? 0) - (supportedEntries?.length ?? 0);
  $: hiddenText = `${numHidden} ${
    numHidden === 1 ? "entry uses" : "entries use"
  } unsupported encoding.`;

  $: filteredText = `${entries.length - filteredEntries.length} ${
    entries.length - filteredEntries.length === 1 ? "entry" : "entries"
  } hidden by filters.`;

  $: {
    selectedTypeOption;
    selectedSimDataGroup;
    nameInputValue;
    instInputValue;

    const isFiltered =
      selectedTypeOption ||
      selectedSimDataGroup ||
      nameInputValue ||
      instInputValue;

    filteredEntries = isFiltered ? entries.filter(entryFilter) : entries;
  }

  onMount(() => {
    selectedIndex = entries[0].id;
  });

  function entryFilter(entry: ResourceKeyPair): boolean {
    console.log("hi");

    if (selectedTypeOption) {
      if (entry.key.type !== selectedTypeOption) return false;

      if (selectedTypeOption === BinaryResourceType.SimData) {
        if (selectedSimDataGroup && selectedSimDataGroup !== entry.key.group)
          return false;
      }
    }

    if (
      nameInputValue &&
      !getDisplayName(entry)
        .toLowerCase()
        .includes(nameInputValue.toLowerCase())
    )
      return false;

    if (
      instInputValue &&
      !formatResourceInstance(entry.key.instance).includes(
        instInputValue.toUpperCase()
      )
    )
      return false;

    return true;
  }

  function clearFilters() {
    selectedTypeOption = 0;
    selectedSimDataGroup = 0;
    nameInputValue = "";
    instInputValue = "";
    showFilterWindow = false;
  }
</script>

<div id="entries-menu" class="px-half">
  <div class="w-100 flex-space-between">
    <p class="small-title">File Explorer</p>
    <div class="flex flex-gap">
      <button
        class="button-wrapper"
        on:click={() => (showFilterWindow = !showFilterWindow)}
        title="Filter"
      >
        <img src="./assets/filter.svg" class="is-svg" alt="Filter" />
      </button>
      <button class="button-wrapper" on:click={onClose} title="Close">
        <img src="./assets/x.svg" class="is-svg" alt="Close" />
      </button>
    </div>
  </div>
  <div class="entries-wrapper">
    {#if pkg != undefined}
      {#if numHidden > 0}
        <div class="flex-center-v flex-space-between mb-1 nowrap">
          <div class="flex-center-v flex-gap-small">
            <img
              src="./assets/warning-outline.svg"
              class="is-svg warning-svg"
              alt="Warning"
            />
            <p class="subtle-text my-0">{hiddenText}</p>
          </div>
          <button
            class="button-wrapper"
            on:click={() => (showUnsupported = !showUnsupported)}
          >
            <p class="subtle-text my-0 underline accent-color-secondary">
              {showUnsupported ? "HIDE" : "SHOW"}
            </p>
          </button>
        </div>
      {/if}
      {#if filteredEntries && filteredEntries?.length !== entries?.length}
        <div class="flex-center-v flex-space-between mb-1 nowrap">
          <div class="flex-center-v flex-gap-small">
            <img
              src="./assets/warning-outline.svg"
              class="is-svg warning-svg"
              alt="Warning"
            />
            <p class="subtle-text my-0">
              {filteredText}
            </p>
          </div>
          <button class="button-wrapper" on:click={clearFilters}>
            <p class="subtle-text my-0 underline accent-color-secondary">
              CLEAR
            </p>
          </button>
        </div>
      {/if}
      {#each filteredEntries as entry (entry.id)}
        <PackageEntryRow
          onClick={() => (selectedIndex = entry.id)}
          {entry}
          active={selectedIndex === entry.id}
        />
      {/each}
    {/if}
  </div>
</div>

{#if showFilterWindow}
  <MovableWindow title="Filter" onClose={() => (showFilterWindow = false)}>
    <div>
      <Select
        label="only files with type"
        name="resource-type-filter"
        bind:selected={selectedTypeOption}
        options={typeOptions}
        fillWidth={true}
      />
      <br />
      {#if selectedTypeOption === BinaryResourceType.SimData}
        <Select
          label="only simdatas with group"
          name="simdata-group-filter"
          bind:selected={selectedSimDataGroup}
          options={simdataGroupOptions}
          fillWidth={true}
        />
        <br />
      {/if}
      <TextInput
        label="only filenames containing"
        name="filename-filter"
        placeholder="Filename"
        bind:value={nameInputValue}
        fillWidth={true}
      />
      <br />
      <TextInput
        label="only instances containing"
        name="instance-filter"
        placeholder="Instance"
        bind:value={instInputValue}
        fillWidth={true}
      />
    </div>
  </MovableWindow>
{/if}

<style lang="scss">
  #entries-menu {
    background-color: var(--color-bg-secondary);
    height: 100%;
    min-width: 200px;

    img {
      height: 1.2em;
      width: auto;
    }

    .entries-wrapper {
      overflow-y: auto;
      max-height: 92%;
    }
  }
</style>
