<script lang="ts">
  import type { GeneratedFileEntryData } from "lib/generator/types";
  const { TuningResourceType, SimDataGroup } = window.S4TK.enums;
  const { formatAsHexString } = window.S4TK.formatting;

  export let entry: GeneratedFileEntryData;

  $: tuningName = TuningResourceType[entry.type];

  $: simDataGroup = formatAsHexString(
    SimDataGroup.getForTuning(entry.type) ?? 0,
    8,
    false
  );

  $: simDataError = SimDataGroup.getForTuning(entry.type) == undefined;
</script>

<div class="flex items-center justify-between">
  {#if simDataError}
    <p
      class="text-red-600 dark:text-red-400 text-subtle uppercase font-bold text-sm"
    >
      Tuning type "{tuningName}" does not have simdata
    </p>
  {:else}
    <p class="text-subtle uppercase font-bold text-sm">
      + {tuningName} SimData (<span class="monospace">{simDataGroup}</span>)
    </p>
  {/if}
</div>
