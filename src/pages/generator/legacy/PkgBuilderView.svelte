<script lang="ts">
  import { onDestroy } from "svelte";
  import { subscribeToKey } from "lib/utils/keybindings";
  import IconButton from "./elements/IconButton.svelte";
  import GeneratedFileEntry from "./GeneratedFileEntry.svelte";
  import type {
    GeneratedFileEntryData,
    GeneratedFilesData,
    GlobalSettings,
  } from "lib/generator/types";
  import BuilderHeader from "./BuilderHeader.svelte";
  import EmptyBuilderContent from "./EmptyBuilderContent.svelte";
  const { enums } = window.S4TK;

  export let globalSettings: GlobalSettings;
  export let fileData: GeneratedFilesData;

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

<div class="flex flex-col w-full items-center">
  <BuilderHeader bind:globalSettings />
  <div
    class="py-10 w-full xl:max-w-screen-xl px-4 flex flex-col justify-center gap-8"
  >
    {#if fileData?.entries.length > 0}
      <div class="flex flex-col-reverse gap-4">
        {#each fileData.entries as entry (entry.id)}
          <GeneratedFileEntry bind:fileData bind:globalSettings bind:entry />
        {/each}
      </div>
    {:else}
      <EmptyBuilderContent />
    {/if}
  </div>
</div>

<div class="fixed bottom-4 right-4 flex gap-2">
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
