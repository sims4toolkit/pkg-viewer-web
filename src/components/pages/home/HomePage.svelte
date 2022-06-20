<script lang="ts">
  import Footer from "../../Footer.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";
  import FileInput from "../../shared/FileInput.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";
</script>

<svelte:head>
  <title>Package Viewer</title>
</svelte:head>

<section id="home-section" class="flex-col flex-space-between">
  <div>
    <ContentArea>
      <SectionHeader title="View a package" />
      <p>Upload a Sims 4 package file to view it and scan it for issues.</p>
      <FileInput accept=".package" label="choose a package file" />
    </ContentArea>
  </div>
  <Footer />
</section>

<style lang="scss">
  #home-section {
    min-height: 100vh;
  }
</style>
