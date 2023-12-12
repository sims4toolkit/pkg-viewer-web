<script lang="ts">
  import { onDestroy } from "svelte";
  import type { DiagnosticLevel } from "@s4tk/validation";
  import Settings, { SettingsSubscriptionManager } from "lib/utils/settings";
  const { DiagnosticLevel: Level } = window.S4TK.validation;

  export let level: DiagnosticLevel;
  export let inline = false;

  let theme = Settings.isLightTheme ? "light" : "dark";

  $: alt = Level[level].toLowerCase();
  $: imgSrc = level === Level.Warning ? `warning-${theme}` : alt;

  const subscriptions = [
    SettingsSubscriptionManager.subscribe("isLightTheme", (isLightTheme) => {
      theme = isLightTheme ? "light" : "dark";
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });
</script>

<img
  src="./assets/diagnostics/{imgSrc}.svg"
  {alt}
  class="h-4 w-4"
  class:inline
/>
