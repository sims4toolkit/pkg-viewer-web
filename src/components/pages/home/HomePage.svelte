<script lang="ts">
  import Footer from "../../Footer.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";
  import ToolView from "./ToolView.svelte";
</script>

<svelte:head>
  <title>Package Viewer</title>
</svelte:head>

<section id="home-section" class="flex-col flex-space-between">
  <ContentArea>
    <div class="floating-card-group mt-2">
      <ToolView
        name="Package Viewer"
        description="View the contents of a package and scan it for potential issues."
        link="view"
      />
      <ToolView
        name="File Generator"
        description="Mass generate tuning and SimData files with custom templates."
        link="generate"
      />
    </div>
  </ContentArea>
  <Footer />
</section>

<style lang="scss">
  #home-section {
    min-height: 100vh;
  }
</style>
