<script lang="ts">
  // legacy file from old package viewer
  import { onMount } from "svelte";

  export let label: string = undefined;
  export let name: string;
  export let placeholder: string;
  export let monospace = false;
  export let value: string = "";
  export let fillWidth = false;
  export let focusOnMount = false;
  export let isValid = true;

  let input: HTMLInputElement;

  onMount(() => {
    if (focusOnMount) input.focus();
  });
</script>

<div class:flex-grow={fillWidth}>
  {#if Boolean(label)}
    <div class="flex items-center">
      <label
        class="text-subtle uppercase font-bold text-sm mb-2 block"
        for={name}>{label}</label
      >
    </div>
  {/if}
  <input
    id={name}
    bind:this={input}
    {name}
    type="text"
    class:monospace
    class:w-full={fillWidth}
    class="h-8 px-2 block bg-gray-100 dark:bg-gray-800 rounded border border-solid border-gray-600 dark:border-gray-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
    class:invalid={!isValid}
    bind:value
    {placeholder}
    autocomplete="off"
  />
</div>

<style lang="scss">
  input.invalid {
    border-color: var(--color-danger);
  }
</style>
