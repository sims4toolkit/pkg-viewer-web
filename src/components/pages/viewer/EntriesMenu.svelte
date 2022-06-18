<script lang="ts">
  export let onClose: () => void;
</script>

<button class="button-wrapper" on:click={onClose}>
  <img src="./assets/x.svg" class="is-svg" alt="Close" />
</button>

<style lang="scss">
  // intentionally blank
</style>
