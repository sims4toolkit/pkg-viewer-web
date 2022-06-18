<script lang="ts">
  import { onMount } from "svelte";
  import { navbarTextStore } from "../../../typescript/stores";

  export let params: { cdn: string };

  onMount(() => {
    navbarTextStore.set(params.cdn);
  });
</script>

<svelte:head>
  <title>Pkg...</title>
</svelte:head>

<section id="viewer-section">
  <p>Testing: {params.cdn}</p>
</section>

<style lang="scss">
  // intentionally blank
</style>
