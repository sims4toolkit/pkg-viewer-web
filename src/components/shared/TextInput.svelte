<script lang="ts">
  export let label: string = undefined;
  export let name: string;
  export let placeholder: string;
  export let monospace = false;
  export let value: string = "";
  export let fillWidth = false;
</script>

<div class="text-input" class:w-100={fillWidth}>
  {#if Boolean(label)}
    <div class="flex-center-v">
      <label class="small-title" for={name}>{label}</label>
    </div>
  {/if}
  <input
    id={name}
    {name}
    type="text"
    class:monospace
    class:w-100={fillWidth}
    class="mt-half input-height"
    bind:value
    {placeholder}
    autocomplete="off"
  />
</div>

<style lang="scss">
  .text-input {
    input,
    label {
      display: block;
    }
  }
</style>
