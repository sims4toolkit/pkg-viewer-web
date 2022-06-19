<script lang="ts">
  import { onMount } from "svelte";
  import { navbarTextStore, navbarTitleType } from "../../../typescript/stores";
  import ContentArea from "../../layout/ContentArea.svelte";
  import GradientHeader from "../../shared/GradientHeader.svelte";

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
    <GradientHeader title="How'd you get here?" />
    <p>
      This website is for viewing Sims 4 package files that were sent on
      Discord. Unless the S4TK Bot sends a link for you to click on, you
      probably don't need to be here.
    </p>
    <p>
      Created by <a href="https://frankkmods.com" target="_blank">Frankk</a>
      using
      <a href="https://sims4toolkit.com" target="_blank">Sims 4 Toolkit</a>.
    </p>
  </ContentArea>
</section>

<style lang="scss">
  // intentionally blank
</style>
