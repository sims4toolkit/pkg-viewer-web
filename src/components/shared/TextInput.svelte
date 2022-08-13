<script lang="ts">
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

<div class="text-input" class:fill-width={fillWidth}>
  {#if Boolean(label)}
    <div class="flex-center-v">
      <label class="small-title mb-half" for={name}>{label}</label>
    </div>
  {/if}
  <input
    id={name}
    bind:this={input}
    {name}
    type="text"
    class:monospace
    class:w-100={fillWidth}
    class="input-height"
    class:invalid={!isValid}
    bind:value
    {placeholder}
    autocomplete="off"
  />
</div>

<style lang="scss">
  .text-input {
    &.fill-width {
      flex-grow: 1;
    }

    input,
    label {
      display: block;
    }

    input.invalid {
      border-color: var(--color-error);
    }
  }
</style>
