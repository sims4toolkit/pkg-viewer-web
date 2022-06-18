<script>
  // this only exists because svelte-prism doesn't play nice with TS
  import Prism from "svelte-prism";
  export let language = "xml";
</script>

<Prism {language}>
  <slot />
</Prism>

<style lang="scss">
  // intentionally blank
</style>
