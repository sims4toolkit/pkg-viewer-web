<script lang="ts">
  import { link } from "svelte-spa-router";
  import Footer from "../../Footer.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";
</script>

<svelte:head>
  <title>Package Viewer</title>
</svelte:head>

<section id="home-section" class="flex-col flex-space-between">
  <div>
    <ContentArea>
      <SectionHeader title="Welcome" />
      <p class="mt-2">
        This website is for viewing Sims 4 package files. Unless you were
        directed here by the S4TK Discord bot, you probably don't need to be
        here.
      </p>
      <p>
        Though, you can <a href="/view" use:link>upload a package</a> for funsies
        if you want.
      </p>
    </ContentArea>
  </div>
  <Footer />
</section>

<style lang="scss">
  #home-section {
    min-height: 100vh;
  }
</style>
