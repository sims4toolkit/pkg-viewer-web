<script lang="ts">
  import { onDestroy } from "svelte";
  import ViewerEvents from "lib/viewer/viewer-events";

  export let compactTitle: string;

  let isSecondaryExpanded = false;

  const subscriptions = [
    ViewerEvents.onUserClickedFile.subscribe(() => {
      isSecondaryExpanded = false;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  $: compactTitlePrefix = isSecondaryExpanded ? "close" : "open";
  $: compactImgSrc = isSecondaryExpanded ? "x" : "list";
</script>

<div class="w-full h-full relative">
  <button
    class="absolute h-10 top-0 right-0 left-0 w-full bg-gray-100 dark:bg-gray-900 border-b border-solid border-b-gray-300 dark:border-b-gray-700"
    on:click={() => (isSecondaryExpanded = !isSecondaryExpanded)}
  >
    <p class="text-sm uppercase font-bold text-subtle">
      {compactTitlePrefix}
      {compactTitle}
    </p>
    <img
      src="./assets/icons/{compactImgSrc}.svg"
      alt={compactImgSrc}
      class="svg h-4 w-4 absolute right-3 top-3"
    />
  </button>
  <div class="absolute top-10 bottom-0 right-0 left-0">
    <slot name="primary" />
  </div>
  <div
    class="absolute top-10 bottom-0 right-0 left-0"
    hidden={!isSecondaryExpanded}
  >
    <slot name="secondary" />
  </div>
</div>
