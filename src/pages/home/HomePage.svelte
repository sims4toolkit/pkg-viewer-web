<script lang="ts">
  import Footer from "components/Footer.svelte";
  import ToolCardLink from "./ToolCardLink.svelte";
  import SectionHeader from "components/elements/SectionHeader.svelte";
</script>

<svelte:head>
  <title>S4TK Package Tools</title>
</svelte:head>

<section class="pt-10 flex-1 w-full flex justify-center">
  <div
    class="py-10 w-full xl:max-w-screen-xl px-4 flex flex-col justify-center gap-8"
  >
    <div>
      <SectionHeader title="Available Tools" />
    </div>
    <div class="flex flex-col md:flex-row gap-8 items-center">
      <ToolCardLink
        title="Package Viewer"
        subtitle="Version 2.0"
        href="#/view"
        image="viewer.png"
      />
      <ToolCardLink
        title="Tuning Generator"
        subtitle="Legacy Tool"
        href="#/generate"
        image="generator.png"
      />
    </div>
  </div>
</section>
<Footer />
