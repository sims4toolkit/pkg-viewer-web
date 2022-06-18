<script lang="ts">
  import { onMount } from "svelte";
  import { navbarTextStore } from "../../../typescript/stores";

  import ContentArea from "../../layout/ContentArea.svelte";

  onMount(() => {
    navbarTextStore.set("Package Viewer");
  });
</script>

<svelte:head>
  <title>Package Viewer</title>
</svelte:head>

<section id="home-section" class="flex-center-v">
  <ContentArea>
    <h2>Hello</h2>
    <a href="#/discord/a">Go to viewer.</a>
  </ContentArea>
</section>

<style lang="scss">
  // intentionally blank
</style>
