<script lang="ts">
  import type { GeneratedFileEntry } from "./types";
  const { TuningResourceType, SimDataGroup } = window.S4TK.enums;
  const { formatAsHexString } = window.S4TK.formatting;

  export let entry: GeneratedFileEntry;

  $: tuningName = TuningResourceType[entry.type];

  $: simDataGroup = formatAsHexString(
    SimDataGroup.getForTuning(entry.type) ?? 0,
    8,
    false
  ); // FIXME:

  $: simDataError = SimDataGroup.getForTuning(entry.type) == undefined;
</script>

<div class="flex-space-between flex-center-v">
  {#if simDataError}
    <p class="my-0 error-color small-text uppercase bold">
      Tuning type "{tuningName}" does not have simdata
    </p>
  {:else}
    <p class="my-0 small-title">
      + {tuningName} SimData (<span class="monospace">{simDataGroup}</span>)
    </p>
  {/if}
</div>

<style lang="scss">
  // intentionally blank
</style>
