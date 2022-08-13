<script lang="ts">
  export let label: string;
  export let disabled = false;

  // only need one or the other, not both
  export let checked = undefined;
  export let checkable: {
    checked: boolean;
  } = undefined;
</script>

<div class="checkbox">
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label {disabled}>
    {#if checkable}
      <input type="checkbox" bind:checked={checkable.checked} {disabled} />
    {:else}
      <input type="checkbox" bind:checked {disabled} />
    {/if}
    {label}
  </label>
</div>

<style lang="scss">
  .checkbox {
    white-space: nowrap;

    input,
    label {
      &:hover:not(:disabled) {
        cursor: pointer;
      }

      &:disabled {
        opacity: 0.65;
        pointer-events: none;
      }
    }
  }
</style>
