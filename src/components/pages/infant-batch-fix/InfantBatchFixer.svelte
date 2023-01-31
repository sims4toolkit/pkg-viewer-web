<script lang="ts">
  import FileInput from "../../shared/FileInput.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";
  const { Buffer } = window.S4TK.Node;
  const { Package } = window.S4TK.models;
  const { BinaryResourceType, SimDataGroup } = window.S4TK.enums;

  let files: FileList;
  let processingComplete = false;

  $: filesUploaded = Boolean(files) && files.length > 0;

  $: {
    if (filesUploaded) processFiles();
  }

  async function processFiles() {
    processingComplete = false;

    for (let i = 0; i < files.length; ++i) {
      const file = files[i];
      await processPackage(file);
    }

    processingComplete = true;
  }

  async function processPackage(file: File) {
    const arrBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrBuffer);

    const pkg = Package.from(buffer, {
      loadRaw: true,
    });

    console.log(pkg.size);
  }
</script>

<SectionHeader title="Step 1: Upload your packages" />
<p>
  All eligible SimDatas in these packages will be fixed, and you will then be
  asked if you want to fix your tuning.
</p>
<FileInput
  accept=".package"
  multiple={true}
  bind:files
  label="Upload Packages"
/>
{#if filesUploaded}
  {#if processingComplete}
    <p>Files processed</p>
  {:else}
    <p>Processing files...</p>
  {/if}
{/if}

<style lang="scss">
  // intentionally blank
</style>
