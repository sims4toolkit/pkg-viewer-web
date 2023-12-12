<script lang="ts">
  import type { DiagnosticInfo } from "@s4tk/validation";
  import Diagnostics from "lib/viewer/diagnostics";
  import DiagnosticsBubbleItem from "./DiagnosticsBubbleItem.svelte";
  const { DiagnosticLevel: Level } = window.S4TK.validation;

  export let diagnostics: readonly DiagnosticInfo[];

  $: filtered = diagnostics.filter((d) => Diagnostics.passesSettings(d));
  $: numErrors = Diagnostics.countExact(Level.Error, filtered);
  $: numWarnings = Diagnostics.countExact(Level.Warning, filtered);
  $: numInfos = Diagnostics.countExact(Level.Info, filtered);
</script>

<div
  class="flex-shrink-0 flex items-center gap-2 flex-nowrap whitespace-nowrap"
>
  {#if Boolean(numErrors)}
    <DiagnosticsBubbleItem level={Level.Error} count={numErrors} />
  {/if}
  {#if Boolean(numWarnings)}
    <DiagnosticsBubbleItem level={Level.Warning} count={numWarnings} />
  {/if}
  {#if Boolean(numInfos)}
    <DiagnosticsBubbleItem level={Level.Info} count={numInfos} />
  {/if}
</div>
