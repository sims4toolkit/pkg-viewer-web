<script lang="ts">
  import { onDestroy } from "svelte";
  import { subscribeToKey } from "lib/utils/keybindings";
  import PackageViewerPage from "pages/viewer/PackageViewerPage.svelte";
  import LoadingIndicator from "components/elements/LoadingIndicator.svelte";
  import PkgGeneratorPage from "./legacy/PkgGeneratorPage.svelte";
  import IconTextButton from "./legacy/elements/IconTextButton.svelte";
  import GeneratorEvents from "lib/generator/generator-events";
  import GeneratorState from "lib/generator/generator-state";

  //#region Constants / Variables

  let isPreviewingPackage = false;
  let isPackagePreviewReady = false;

  //#endregion

  //#region Lifecycle

  const subscriptions = [
    GeneratorEvents.onPreviewingPackageChange.subscribe((value) => {
      isPreviewingPackage = value;
    }),
    GeneratorEvents.onPackagePreviewReadyChange.subscribe((value) => {
      isPackagePreviewReady = value;
    }),
    subscribeToKey("b", togglePackagePreview, {
      ctrlOrMeta: true,
      preventDefault: true,
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  //#endregion

  //#region Functions

  function togglePackagePreview() {
    if (isPreviewingPackage) {
      GeneratorState.requestBuilder();
    } else {
      GeneratorState.requestPreviewer();
    }
  }

  //#endregion
</script>

<svelte:head>
  <title>S4TK Package Generator</title>
</svelte:head>

<div
  class="fixed z-30 top-14 right-4 hover:opacity-100"
  class:opacity-50={isPreviewingPackage}
>
  <IconTextButton
    icon={isPreviewingPackage ? "pencil" : "hammer"}
    text={isPreviewingPackage ? "Edit" : "Build"}
    onClick={togglePackagePreview}
    useBg={true}
  />
</div>

{#if isPreviewingPackage}
  {#if isPackagePreviewReady}
    <PackageViewerPage />
  {:else}
    <section class="pt-10 h-screen w-screen flex items-center justify-center">
      <div class="flex flex-col items-center gap-8">
        <p>Building package...</p>
        <LoadingIndicator />
      </div>
    </section>
  {/if}
{:else}
  <PkgGeneratorPage />
{/if}
