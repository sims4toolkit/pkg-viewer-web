<script>
  // this only exists because svelte-prism doesn't play nice with TS
  import Prism from "svelte-prism";
  export let language = "xml";
</script>

<div class="prism-wrapper">
  <Prism {language}>
    <slot />
  </Prism>
</div>

<style lang="scss">
  .prism-wrapper {
    max-width: 100%;
    overflow-x: auto;
  }
</style>
