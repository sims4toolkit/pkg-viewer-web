<script lang="ts">
  import type { Package } from "@s4tk/models";
  import EntriesMenu from "./EntriesMenu.svelte";
  import ResizableSplitView from "../../layout/ResizableSplitView.svelte";
  import { scanPackageForWarnings } from "../../../typescript/helpers";
  import MovableWindow from "../../layout/MovableWindow.svelte";
  import EntryView from "./EntryView.svelte";
  import type { ResourceEntry } from "@s4tk/models/types";

  const { EncodingType, TuningResourceType } = window.S4TK.enums;

  export let pkgName: string;
  export let pkg: Package;

  const warnings = scanPackageForWarnings(pkg);
  let splitview: any;
  let numWarnings = 0;
  let selectedIndex = 0;
  let showWarnings = false;
  let otherWarnings: { entryId: number; text: string }[];

  $: entry = pkg?.get(selectedIndex);

  $: {
    numWarnings = 0;
    otherWarnings = [];
    warnings?.forEach((entryWarnings, entryId) => {
      numWarnings += entryWarnings.length;
      if (entryId !== selectedIndex)
        otherWarnings.push(...entryWarnings.map((text) => ({ entryId, text })));
    });
  }

  function collapseFileExplorer() {
    splitview.collapseLeftPanel();
  }

  function goToFile(instance: bigint) {
    const id = getIdOfInstance(instance);
    if (id >= 0) setId(id);
  }

  function pkgHasInstance(instance: bigint): boolean {
    const id = getIdOfInstance(instance);
    return id !== selectedIndex && id >= 0;
  }

  function getIdOfInstance(instance: bigint): number {
    for (let i = 0; i < pkg.size; ++i) {
      const entry = pkg.entries[i];
      if (canJumpToEntry(entry) && entry.key.instance === instance)
        return entry.id;
    }

    return -1;
  }

  function canJumpToEntry(entry: ResourceEntry): boolean {
    return (
      entry.key.type in TuningResourceType ||
      entry.value.encodingType === EncodingType.DDS
    );
  }

  function setId(id: number) {
    selectedIndex = id;
  }
</script>

<ResizableSplitView leftPanelName="File Explorer" bind:this={splitview}>
  <EntriesMenu
    slot="left"
    onClose={collapseFileExplorer}
    onWarningClick={() => (showWarnings = true)}
    bind:selectedIndex
    bind:pkg
    {pkgName}
    {warnings}
  />
  <EntryView slot="right" {entry} {goToFile} {pkgHasInstance} />
</ResizableSplitView>

{#if showWarnings}
  <MovableWindow title="Warnings" onClose={() => (showWarnings = false)}>
    <div>
      {#if warnings.get(selectedIndex)?.length > 0}
        <p class="small-title my-0">
          current file ({warnings.get(selectedIndex)?.length})
        </p>
        {#each warnings.get(selectedIndex) as warning, key (key)}
          <div class="flex flex-gap-small mt-half">
            <img
              src="./assets/warning-outline.svg"
              class="is-svg warning-svg text-height"
              alt="Warning"
            />
            <p class="my-0">{warning}</p>
          </div>
        {/each}
      {:else}
        <p class="small-title mb-0">no warnings in current file</p>
      {/if}
      {#if otherWarnings && otherWarnings.length > 0}
        <hr class="my-1" />
        <p class="small-title my-0">
          other files ({otherWarnings.length})
        </p>
        {#each otherWarnings as warning, key (key)}
          <div class="mt-half">
            <button
              class="button-wrapper flex flex-gap-small text-left"
              on:click={() => setId(warning.entryId)}
            >
              <img
                src="./assets/warning-outline.svg"
                class="is-svg warning-svg text-height"
                alt="Warning"
              />
              <p class="my-0">{warning.text}</p>
            </button>
          </div>
        {/each}
      {/if}
    </div>
  </MovableWindow>
{:else if numWarnings > 0}
  <button
    id="warning-button"
    class="button-wrapper drop-shadow"
    on:click={() => (showWarnings = true)}
  >
    <div class="flex-center-v flex-gap-small my-half mx-1">
      <img
        src="./assets/warning-outline.svg"
        class="is-svg warning-svg"
        alt="Warning"
      />
      <p class="my-0 nowrap">
        {numWarnings}
        {numWarnings === 1 ? "warning!" : "warnings!"}
      </p>
    </div>
  </button>
{/if}

<style lang="scss">
  #warning-button {
    position: fixed;
    right: 20px;
    bottom: 20px;
    background-color: var(--color-bg-secondary);
    border-radius: 4px;

    img {
      height: 1.2em;
      width: auto;
    }
  }
</style>
