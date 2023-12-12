<script lang="ts">
  export let onClose: () => void = null;
  export let anchorToTop = false;
</script>

<div
  class="fixed top-0 bottom-0 left-0 right-0 z-50 flex justify-center bg-black bg-opacity-50 dark:bg-opacity-60"
  class:items-start={anchorToTop}
  class:items-center={!anchorToTop}
>
  {#if Boolean(onClose)}
    <button class="absolute top-4 right-4" on:click={onClose}
      ><img src="./assets/icons/x.svg" alt="X" class="svg h-10 w-10" /></button
    >
  {/if}
  <slot />
</div>
