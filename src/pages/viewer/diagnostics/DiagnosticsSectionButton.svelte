<script lang="ts">
  export let title: string;
  export let countText: string;
  export let active: boolean;
  export let onClick: () => void;
</script>

<button
  class="px-1 pb-1 border-b border-solid border-b-transparent"
  class:active
  on:click={onClick}
>
  <p class="text-xs text-gray-400 dark:text-gray-400" class:active>
    <span class="uppercase text-inherit">{title}</span>
    ({countText})
  </p>
</button>

<style lang="scss">
  button.active {
    border-bottom-color: var(--color-text) !important;
  }

  p.active {
    color: var(--color-text) !important;
  }
</style>
