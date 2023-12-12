<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import GeneratorEvents from "lib/generator/generator-events";
  import type { GeneratedFilesData, GlobalSettings } from "lib/generator/types";
  import LoadingIndicator from "components/elements/LoadingIndicator.svelte";
  import PkgBuilderView from "./PkgBuilderView.svelte";
  import GeneratorState from "lib/generator/generator-state";

  //#region Constants / Variables

  let fileData: GeneratedFilesData;
  let globalSettings: GlobalSettings;
  $: dataLoaded = fileData && globalSettings;

  $: {
    if (fileData && globalSettings) {
      GeneratorState.saveToStorage();
    }
  }

  //#endregion

  //#region Lifecycle

  const subscriptions = [
    GeneratorEvents.onFileDataChange.subscribe((value) => {
      fileData = value;
    }),
    GeneratorEvents.onGlobalSettingsChange.subscribe((value) => {
      globalSettings = value;
    }),
  ];

  onMount(() => {
    GeneratorState.initializeFromStorage();
  });

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  //#endregion
</script>

<section class="pt-10 h-screen w-full flex justify-center">
  {#if dataLoaded}
    <PkgBuilderView bind:fileData bind:globalSettings />
  {:else}
    <div class="my-auto flex flex-col items-center gap-8">
      <p>Loading saved data...</p>
      <LoadingIndicator />
    </div>
  {/if}
</section>
