<script lang="ts">
  import { onMount } from "svelte";
  import Footer from "../../Footer.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";
  import InfantBatchFixer from "./InfantBatchFixer.svelte";
  import type { TdescIndexEntry } from "./types";

  //#region Variables

  const TUNING_INDEX_URL =
    "https://raw.githubusercontent.com/sims4toolkit/misc/main/web-data/infant-fix-tuning-index.json";

  const SIMDATA_INDEX_URL =
    "https://raw.githubusercontent.com/sims4toolkit/misc/main/web-data/infant-fix-simdata-index.json";

  let simdataIndex: TdescIndexEntry[];
  let simdataIndexError = false;

  let tuningIndex: TdescIndexEntry[];
  let tuningIndexError = false;

  let showingImpactedTunings = false;

  $: simdataTypes = formatTdescEntries(simdataIndex);
  $: tuningTypes = formatTdescEntries(tuningIndex);

  //#endregion

  //#region Lifecycle

  onMount(() => {
    fetchFileIndex();
  });

  //#endregion

  //#region Functions

  async function fetchFileIndex() {
    fetch(SIMDATA_INDEX_URL)
      .then((data) => data.json())
      .then((json) => (simdataIndex = json))
      .catch((err) => {
        console.error(err);
        simdataIndexError = true;
      });

    fetch(TUNING_INDEX_URL)
      .then((data) => data.json())
      .then((json) => (tuningIndex = json))
      .catch((err) => {
        console.error(err);
        tuningIndexError = true;
      });
  }

  function formatTdescLink(entry: TdescIndexEntry): string {
    return `https://lot51.cc/tdesc/${entry.path}/${entry.tdesc}.tdesc`;
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
          `<a href="${formatTdescLink(entry)}" target="_blank">${
            entry.tdesc
          }</a>`
      )
      .join(", ");
  }

  //#endregion
</script>

<svelte:head>
  <title>Infant Batch Fix</title>
</svelte:head>

<section id="infant-batch-fix-section">
  {#if !(Boolean(simdataIndex) && Boolean(tuningIndex))}
    <ContentArea>
      {#if simdataIndexError || tuningIndexError}
        <p>Could not retrieve the file indices.</p>
      {:else}
        <p>Fetching file indices...</p>
      {/if}
    </ContentArea>
  {:else}
    <ContentArea banded={true} bottomShadow={true}>
      <SectionHeader title="Infant Batch Fix" />
      <p>
        The infant update added a value to the <code
          class="accent-color-secondary">Age</code
        > enum, shifting its integer values. This breaks SimDatas containing ages,
        and implies that some files referencing babies and/or toddlers may need to
        be updated as well. This tool will automatically fix your SimDatas, and point
        out any files that mention babies and/or toddlers.
      </p>

      <p class="subtle-text mb-0">
        Impacted SimDatas: {@html simdataTypes}
      </p>
      <button
        class="mt-1 mb-0"
        on:click={() => (showingImpactedTunings = !showingImpactedTunings)}
        >{showingImpactedTunings ? "Hide" : "Show"} Potentially Impacted Tunings</button
      >
      {#if showingImpactedTunings}
        <p class="subtle-text">
          These are all of the tuning types that may contain ages, according to
          the TDESCs. While they are not necessarily broken, you may want to
          remove BABY/TODDLER or add INFANT in some of them. The batch fixer
          will find all of these instances, and allow you to toggle their age
          tags.
        </p>
        <div class="scrollable-text-wrapper">
          <p class="subtle-text my-0">
            {@html tuningTypes}
          </p>
        </div>
      {/if}
    </ContentArea>
    <ContentArea>
      <InfantBatchFixer />
    </ContentArea>
  {/if}
</section>
<Footer />

<style lang="scss">
  #infant-batch-fix-section {
    min-height: 100vh;

    .scrollable-text-wrapper {
      padding: 0.5rem;
      background-color: var(--color-bg);
      border-radius: 0.5rem;
      max-height: 6rem;
      width: 100%;
      overflow-y: auto;
    }

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
