<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import LoadingIndicator from "components/elements/LoadingIndicator.svelte";
  import CompactSplitView from "./CompactSplitView.svelte";
  import LeftRightSplitView from "./LeftRightSplitView.svelte";

  const COMPACT_BREAKPOINT = 640; // sm break size

  export let compactTitle: string;
  export let onCompactChange: () => void = null;
  export let isSwitchingCompact = false;

  let compact = false;
  let hasLoaded = false;

  onMount(() => {
    refreshCompact();
    window.addEventListener("resize", refreshCompact);
  });

  onDestroy(() => {
    window.removeEventListener("resize", refreshCompact);
  });

  function refreshCompact() {
    const newCompact = window.innerWidth <= COMPACT_BREAKPOINT;
    if (hasLoaded && compact !== newCompact && onCompactChange) {
      isSwitchingCompact = true;
      setTimeout(() => {
        onCompactChange();
        isSwitchingCompact = false;
      }, 250); // HACK: time is to wait for switch to happen
    }
    compact = newCompact;
    hasLoaded = true;
  }
</script>

<div class="w-full h-full relative">
  <div
    class="absolute top-0 bottom-0 left-0 right-0"
    hidden={isSwitchingCompact}
  >
    {#if compact}
      <CompactSplitView {compactTitle}>
        <slot name="secondary" slot="secondary" />
        <slot name="primary" slot="primary" />
      </CompactSplitView>
    {:else}
      <LeftRightSplitView>
        <slot name="secondary" slot="left" />
        <slot name="primary" slot="right" />
      </LeftRightSplitView>
    {/if}
  </div>
  {#if isSwitchingCompact}
    <div
      class="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center"
    >
      <LoadingIndicator />
    </div>
  {/if}
</div>
