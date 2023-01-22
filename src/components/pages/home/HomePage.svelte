<script lang="ts">
  import Footer from "../../Footer.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";
  import ToolView from "./ToolView.svelte";
</script>

<svelte:head>
  <title>Package Viewer</title>
</svelte:head>

<section id="home-section" class="flex-col flex-space-between">
  <ContentArea>
    <div class="floating-card-group mt-2">
      <ToolView
        name="Infant Batch Fix"
        description="Batch fix the Age enum's associated int values in SimDatas."
        link="infant-batch-fix"
      />
      <ToolView
        name="Package Viewer"
        description="View the contents of a package and scan it for potential issues."
        link="view"
      />
      <ToolView
        name="Tuning Generator"
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
