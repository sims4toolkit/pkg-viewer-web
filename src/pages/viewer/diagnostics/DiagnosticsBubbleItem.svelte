<script lang="ts">
  import type { DiagnosticLevel } from "@s4tk/validation";
  import DiagnosticsIcon from "components/elements/DiagnosticsIcon.svelte";
  const { DiagnosticLevel: Level } = window.S4TK.validation;

  export let level: DiagnosticLevel;
  export let count: number;

  $: title = Level[level];
  $: className = title.toLowerCase();
</script>

<div
  {title}
  class="flex-shrink-0 flex items-center gap-1 flex-nowrap whitespace-nowrap"
>
  <DiagnosticsIcon {level} />
  <p class="monospace text-xs diagnostics-text {className}">{count}</p>
</div>
