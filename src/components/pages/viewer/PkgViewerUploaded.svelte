<script lang="ts">
  import type { Package } from "@s4tk/models";
  import PkgViewer from "./PkgViewer.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";
  import FileInput from "../../shared/FileInput.svelte";
  import Footer from "../../Footer.svelte";

  const { Package } = window.S4TK.models;
  const { Buffer } = window.S4TK.Node;

  let pkg: Package;
  let pkgName: string;
  let files: FileList;
  let filesInvalid = false;
  let fileError: string = null;

  $: {
    if (files?.length) {
      const file = files[0];
      pkgName = file.name;
      filesInvalid = false;
      fileError = null;
      parsePackage(file);
    }
  }

  async function parsePackage(file: File) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      pkg = await Package.fromAsync(buffer);

      if (!(pkg && pkg.size > 0)) {
        filesInvalid = true;
        fileError = "Package is empty";
      }
    } catch (err) {
      filesInvalid = true;
      fileError = "Could not parse package";
    }
  }
</script>

<svelte:head>
  <title>Package Viewer</title>
</svelte:head>

<section id="discord-pkg-viewer" class="flex-col flex-space-between">
  {#if pkg != undefined && pkg.size > 0}
    <PkgViewer {pkg} {pkgName} />
  {:else}
    <ContentArea>
      <SectionHeader title="Scan package for issues" />
      <p class="mt-2">
        Select a TS4 package file, and its contents will be shown. If any issues
        are detected (e.g. mismatched IDs, incorrect file types, etc.), they
        will be shown in the bottom-right corner. Note that a lack of warnings
        does not mean that everything is working - it only checks for common
        issues.
      </p>
      <p class="mb-2">To scan another package, refresh the page.</p>
      <FileInput
        accept=".package"
        bind:files
        bind:filesInvalid
        errorMessage={fileError}
        label="choose a package"
      />
    </ContentArea>
    <Footer />
  {/if}
</section>

<style lang="scss">
  // intentionally blank
</style>
