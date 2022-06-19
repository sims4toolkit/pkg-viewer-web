<script lang="ts">
  import Footer from "../../Footer.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";
</script>

<svelte:head>
  <title>Package Viewer</title>
</svelte:head>

<section id="home-section" class="flex-col flex-space-between">
  <div>
    <ContentArea banded={true}>
      <SectionHeader title="What is this website for?" />
      <p>
        This website renders Sims 4 package files that are hosted on Discord's
        CDN. This allows you to view a package without downloading it.
      </p>
      <p>
        Note that this website can only render the resources that are
        implemented in <a href="https://sims4toolkit.com" target="_blank"
          >Sims 4 Toolkit</a
        >. At present, this includes all tuning, SimData, and string tables.
      </p>
    </ContentArea>
    <ContentArea>
      <SectionHeader title="Experiencing issues?" />
      <p>
        This website relies on an API that I host myself. If packages aren't
        loading, there is a chance that it is down. Please report this issue to
        me ASAP <a href="https://discord.gg/qNhD3Jh" target="_blank"
          >on Discord</a
        >.
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
