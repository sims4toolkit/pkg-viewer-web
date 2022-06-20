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
    <ContentArea>
      <SectionHeader title="Scan Package for Issues" />
      <p>
        Upload a TS4 package file, and its contents will be shown. If any issues
        are detected (e.g. mismatched IDs, incorrect file types, etc.), they
        will be shown in the bottom-right corner. Note that a lack of warnings
        does not mean that everything is working - it only checks for common
        issues.
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
