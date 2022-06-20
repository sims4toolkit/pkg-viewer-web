<script lang="ts">
  import Footer from "../../Footer.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";
</script>

<svelte:head>
  <title>Package Viewer</title>
</svelte:head>

<section id="help-section" class="flex-col flex-space-between">
  <div>
    <ContentArea banded={true}>
      <SectionHeader title="What is this website for?" />
      <p>
        This website renders Sims 4 package files and displays common issues
        that they contain. It is primarily intended for use with the S4TK
        Discord bot, which sends links to this website so that you can view
        packages without downloading them. However, you can manually upload
        files as well.
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
  #help-section {
    min-height: 100vh;
  }
</style>
