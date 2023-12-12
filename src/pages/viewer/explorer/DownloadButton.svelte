<script lang="ts">
  import CornerAlert from "components/elements/CornerAlert.svelte";

  export let text: string;
  export let onClick: () => void;

  let showConfirmation = false;

  function handleClick() {
    onClick();
    if (!showConfirmation) showConfirmation = true;
  }
</script>

<button
  on:click={handleClick}
  class="download-button flex-1 text-xs px-2 py-1 rounded border border-solid border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black whitespace-nowrap text-ellipsis overflow-hidden"
  title="Download {text}"
>
  {text}</button
>

{#if showConfirmation}
  <CornerAlert text="Downloading {text}..." bind:visible={showConfirmation} />
{/if}
