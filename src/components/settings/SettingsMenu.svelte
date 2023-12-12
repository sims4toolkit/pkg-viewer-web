<script lang="ts">
  import ViewerState from "lib/viewer/viewer-state";
  import SectionHeader from "components/elements/SectionHeader.svelte";
  import SettingsMenuContent from "./SettingsMenuContent.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";

  export let onClose: () => void;

  let saveSettings: () => void;

  function saveButtonPressed() {
    saveSettings();
    ViewerState.requestRefresh();
    onClose();
  }
</script>

<div
  class="w-full max-w-lg h-2/3 mx-2 my-8 p-4 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-xl drop-shadow-md flex flex-col gap-4"
>
  <div>
    <SectionHeader title="Settings" />
  </div>
  <SettingsMenuContent bind:save={saveSettings} />
  <div class="w-full flex justify-end gap-4">
    <div class="mr-auto my-auto"><ThemeToggle /></div>
    <button
      on:click={onClose}
      class="px-3 py-1 rounded border border-solid border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
      >Cancel</button
    >
    <button
      on:click={saveButtonPressed}
      class="px-3 py-1 rounded bg-green-600 text-gray-100 hover:bg-green-700 dark:bg-green-400 dark:text-gray-800 hover:dark:bg-green-300"
      >Save</button
    >
  </div>
</div>
