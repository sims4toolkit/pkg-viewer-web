<script lang="ts">
  import { onMount } from "svelte";
  import { navbarTextStore, navbarTitleType } from "../../../typescript/stores";
  import ContentArea from "../../layout/ContentArea.svelte";

  onMount(() => {
    navbarTextStore.set("Package Viewer");
    navbarTitleType.set("home");
  });
</script>

<svelte:head>
  <title>Package Viewer</title>
</svelte:head>

<section id="home-section" class="flex-center-v">
  <ContentArea>
    <h2>Hello</h2>
    <a href="#/discord/1234567890/1234567890/something.package">Go to viewer.</a
    >
  </ContentArea>
</section>

<style lang="scss">
  // intentionally blank
</style>
