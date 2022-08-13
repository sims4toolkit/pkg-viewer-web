<script lang="ts">
  import TextInput from "../../shared/TextInput.svelte";
  import type { GeneratedFileData, GlobalSettings } from "./types";
  const { fnv32, fnv64 } = window.S4TK.hashing;
  const { formatAsHexString } = window.S4TK.formatting;

  export let globalSettings: GlobalSettings;
  export let entry: GeneratedFileData;

  const initialInstance = (entry.use32bit ? fnv32 : fnv64)(
    globalSettings.filenamePrefix + entry.filename,
    entry.useHighBit
  );

  let manualType = formatAsHexString(entry.type, 8, false);
  let manualGroup = formatAsHexString(0, 8, false);
  let manualInst = formatAsHexString(initialInstance, 16, false);
</script>

<div class="flex-space-between flex-center-v">
  <div class="flex-center-v flex-gap">
    <p class="my-0 small-title">+ Manual Key</p>
    <TextInput
      name="manual-type-input-{entry.id}"
      placeholder="Type"
      monospace={true}
      bind:value={manualType}
    />
    <TextInput
      name="manual-group-input-{entry.id}"
      placeholder="Group"
      monospace={true}
      bind:value={manualGroup}
    />
    <TextInput
      name="manual-inst-input-{entry.id}"
      placeholder="Instance"
      monospace={true}
      bind:value={manualInst}
    />
  </div>
  <span
    class="clickable-text small-text"
    on:click={() => (entry.manualKey = undefined)}>REMOVE</span
  >
</div>

<style lang="scss">
  // intentionally blank
</style>
