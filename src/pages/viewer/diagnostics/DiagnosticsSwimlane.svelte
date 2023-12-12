<script lang="ts">
  import type { DiagnosticInfo } from "@s4tk/validation";
  import ViewerState from "lib/viewer/viewer-state";
  import DiagnosticsIcon from "components/elements/DiagnosticsIcon.svelte";
  import Settings from "lib/utils/settings";
  const { DiagnosticLevel: Level } = window.S4TK.validation;

  export let info: DiagnosticInfo;
  export let showDiagnosticCode: boolean;

  $: fileInfo = ViewerState.getFile(info.ownerId);
  $: fileText = fileInfo
    ? `${fileInfo.resourceKey} = ${fileInfo.displayName}`
    : "Unknown File";
  $: buttonTitle = `[${info.code}] ${fileText}`;

  $: levelText = Level[info.level];
  $: className = levelText.toLowerCase();

  function onClick() {
    ViewerState.requestFile(info.ownerId, true);
  }
</script>

<button
  class="w-full px-2 pb-1 diagnostics-bg {className} text-left"
  title={buttonTitle}
  on:click={onClick}
>
  <DiagnosticsIcon level={info.level} inline={true} />
  <p
    class="mr-1 text-xs uppercase font-bold inline diagnostics-text {className}"
  >
    {levelText}
  </p>
  <p class="text-sm inline">
    {#if showDiagnosticCode}
      <span class="text-subtle monospace">[{info.code}]</span>
    {/if}
    {info.message}
  </p>
</button>
