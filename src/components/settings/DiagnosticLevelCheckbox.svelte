<script lang="ts">
  import type { DiagnosticLevel } from "@s4tk/validation";
  import DiagnosticsIcon from "components/elements/DiagnosticsIcon.svelte";
  import Settings from "lib/utils/settings";
  const { DiagnosticLevel: Level } = window.S4TK.validation;

  export let level: DiagnosticLevel;
  let checked = !Settings.suppressedDiagnosticLevels.has(level);

  $: name = Level[level];
  $: className = name.toLowerCase();
  $: inputId = `setting-level-${className}`;
</script>

<div class="whitespace-nowrap">
  <input id={inputId} {name} type="checkbox" bind:checked />
  <label for={inputId} class="whitespace-nowrap select-none">
    <DiagnosticsIcon {level} inline={true} />
    <p class="monospace text-sm diagnostics-text inline {className}">
      {name}
    </p>
  </label>
</div>
