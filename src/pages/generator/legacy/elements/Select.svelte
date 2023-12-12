<script lang="ts">
  // legacy file from old package viewer
  export let label: string = undefined;
  export let name: string;
  export let selected: number;
  export let fillWidth = false;
  export let small = false;
  export let disabled = false;
  export let options: {
    value: number;
    text: string;
  }[];
</script>

<div class="select-with-label" class:w-full={fillWidth}>
  {#if Boolean(label)}
    <label
      class="text-subtle uppercase font-bold text-sm mb-2"
      class:small
      for={name}>{label}</label
    >
  {/if}
  <select
    {name}
    id={name}
    bind:value={selected}
    class:w-full={fillWidth}
    class:small
    class="pl-2 pr-6 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-solid border-gray-600 dark:border-gray-400"
    {disabled}
  >
    {#each options as option, key (key)}
      <option value={option.value}>
        {option.text}
      </option>
    {/each}
  </select>
</div>

<style lang="scss">
  .select-with-label {
    select {
      &.small {
        font-size: 0.8em;
        padding: {
          left: 0.2rem;
          right: 0.2rem;
          top: 0.15rem;
          bottom: 0.15rem;
        }
      }

      option {
        background-color: var(--color-bg);
      }

      &:disabled {
        opacity: 0.65;
      }
    }

    label,
    select {
      display: block;
    }

    label.small {
      font-size: 0.6em;
    }
  }
</style>
