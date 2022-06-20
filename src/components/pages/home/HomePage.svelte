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
      <SectionHeader title="Scan Package for Issues" />
      <p class="my-2">
        Upload a TS4 package file, and you will be brought to a page that shows
        its contents. If any issues are detected (e.g. mismatched IDs, incorrect
        file types, etc.), they will be shown in the bottom-right corner. Note
        that a lack of warnings does not mean that everything is working - it
        only checks for common issues.
      </p>
      <FileInput accept=".package" label="choose a package" />
    </ContentArea>
  </div>
  <Footer />
</section>

<style lang="scss">
  #home-section {
    min-height: 100vh;
  }
</style>
