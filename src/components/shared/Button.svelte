<script lang="ts">
  export let text: string;
  export let onClick: () => void;
  export let fillWidth = false;
</script>

<button on:click={onClick} class:w-100={fillWidth}>{text}</button>

<style lang="scss">
  button {
    background: none;
    height: 40px;
    border: 1px solid var(--color-bg-secondary);
    background-color: var(--color-card-secondary);
    border-radius: 4px;
    padding: 0.8em;
    color: var(--color-text);

    &:hover {
      cursor: pointer;
      background-color: var(--color-bg-secondary);
    }
  }
</style>
