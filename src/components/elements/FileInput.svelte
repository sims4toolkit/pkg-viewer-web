<script lang="ts">
  import { fade } from "svelte/transition";

  export let accept: string;
  export let label = "";
  export let multiple = false;
  export let filesInvalid = false;
  export let errorMessage = "";
  export let onFilesChanged: (files: FileList) => void;

  let files: FileList = undefined;

  $: {
    if (files !== undefined) onFilesChanged?.(files);
  }
</script>

<div class="w-full">
  {#if Boolean(label)}
    <div class="flex items-center mb-2">
      <label for="file-upload" class="uppercase text-xs font-bold text-subtle"
        >{label}</label
      >
      {#if filesInvalid}
        <p in:fade class="text-xs text-red-600 dark:text-red-400">
          &nbsp;•&nbsp;{errorMessage}
        </p>
      {/if}
    </div>
  {/if}
  <input
    name="file-upload"
    type="file"
    class:border-red-500={filesInvalid}
    class="w-full min-w-0 hover:cursor-pointer border border-solid border-gray-600 dark:border-gray-300 p-2 rounded"
    {accept}
    {multiple}
    bind:files
  />
</div>

<style lang="scss">
  input[type="file"] {
    &::file-selector-button {
      display: none;
    }
  }
</style>
