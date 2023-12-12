<script lang="ts">
  export let text: string;
  export let disabledText: string = text;
  export let onClick: () => void;
  export let fillWidth = false;
  export let disabled = false;
</script>

<button
  on:click={onClick}
  class="px-2 py-1 rounded flex items-center text-black dark:text-white hover:text-white dark:hover:text-black bg-gray-200 dark:bg-gray-800 hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark border border-solid border-gray-600 dark:border-gray-400"
  class:w-full={fillWidth}
  {disabled}>{disabled ? disabledText : text}</button
>

<style lang="scss">
  button:disabled {
    pointer-events: none;
    opacity: 0.65;
  }
</style>
