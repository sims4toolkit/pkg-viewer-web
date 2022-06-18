<script lang="ts">
  export let onClose: () => void;
</script>

<div id="entries-menu">
  <button class="button-wrapper" on:click={onClose}>
    <img src="./assets/x.svg" class="is-svg" alt="Close" />
  </button>
</div>

<style lang="scss">
  #entries-menu {
    background-color: var(--color-bg-secondary);
    height: 100%;
    min-width: 200px;
  }
</style>
