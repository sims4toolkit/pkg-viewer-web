<script lang="ts">
  import { onMount } from "svelte";
  import Footer from "../../Footer.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";
  import FileInput from "../../shared/FileInput.svelte";
  import type { TdescIndexEntry } from "./types";
  const { Buffer } = window.S4TK.Node;
  const { Package } = window.S4TK.models;
  const { BinaryResourceType, SimDataGroup } = window.S4TK.enums;

  let simdataIndex: TdescIndexEntry[];
  let tuningIndex: TdescIndexEntry[];
  let simdataIndexError = false;
  let tuningIndexError = false;
  let showingImpactedTunings = false;

  let files: FileList;
  let processingComplete = false;

  $: filesUploaded = Boolean(files) && files.length > 0;

  $: simdataTypes = formatTdescEntries(simdataIndex);
  $: tuningTypes = formatTdescEntries(tuningIndex);

  $: {
    if (filesUploaded) processFiles();
  }

  function formatTdescEntries(entries: TdescIndexEntry[] | undefined): string {
    return entries
      ?.sort((a, b) => {
        if (a.tdesc < b.tdesc) return -1;
        if (b.tdesc > a.tdesc) return 1;
        return 0;
      })
      .map(
        (entry) =>
          `<a href="https://lot51.cc/tdesc/${entry.path}/${entry.tdesc}.tdesc" target="_blank">${entry.tdesc}</a>`
      )
      .join(", ");
  }

  onMount(() => {
    fetchFileIndex();
  });

  async function fetchFileIndex() {
    fetch(
      "https://raw.githubusercontent.com/sims4toolkit/misc/main/web-data/infant-fix-simdata-index.json"
    )
      .then((data) => data.json())
      .then((json) => (simdataIndex = json))
      .catch((err) => {
        console.error(err);
        simdataIndexError = true;
      });

    fetch(
      "https://raw.githubusercontent.com/sims4toolkit/misc/main/web-data/infant-fix-tuning-index.json"
    )
      .then((data) => data.json())
      .then((json) => (tuningIndex = json))
      .catch((err) => {
        console.error(err);
        tuningIndexError = true;
      });
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

<svelte:head>
  <title>Infant Batch Fix</title>
</svelte:head>

<section id="infant-batch-fix-section" class="flex-col flex-space-between">
  {#if !(Boolean(simdataIndex) && Boolean(tuningIndex))}
    <ContentArea>
      {#if simdataIndexError || tuningIndexError}
        <p>Could not retrieve the file indices.</p>
      {:else}
        <p>Fetching file indices...</p>
      {/if}
    </ContentArea>
  {:else}
    <ContentArea banded={true}>
      <FileInput
        accept=".package"
        multiple={true}
        bind:files
        label="Upload your packages"
      />
      <p class="subtle-text mb-0">
        Impacted SimDatas: {@html simdataTypes}
      </p>
      <button
        class="mt-1 mb-0"
        on:click={() => (showingImpactedTunings = !showingImpactedTunings)}
        >{showingImpactedTunings ? "Hide" : "Show"} Impacted Tunings</button
      >
      {#if showingImpactedTunings}
        <p class="subtle-text">
          These are all of the tuning types that may contain ages, according to
          the TDESCs. While they are likely not broken from this patch, you may
          want to include the new INFANT tag in some of them, depending on your
          mod's logic. The batch fixer will scan files of these types, and if it
          detects usage of either the BABY or TODDLER ages, it will ask if you
          would like to insert an INFANT tag as well.
        </p>
        <p class="subtle-text mb-0">
          {@html tuningTypes}
        </p>
      {/if}
      {#if filesUploaded}
        {#if processingComplete}
          <p>Files processed</p>
        {:else}
          <p>Processing files...</p>
        {/if}
      {/if}
    </ContentArea>
    <ContentArea>
      <p>Placeholder</p>
    </ContentArea>
  {/if}
  <Footer />
</section>

<style lang="scss">
  #infant-batch-fix-section {
    min-height: 100vh;

    button {
      background: none;
      border: solid 1px var(--color-text);
      border-radius: 4px;

      &:hover {
        cursor: pointer;
        background-color: var(--color-accent-secondary);
        border-color: var(--color-accent-secondary);
        color: var(--color-bg);
      }
    }
  }
</style>
