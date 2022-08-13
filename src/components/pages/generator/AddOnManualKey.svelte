<script lang="ts">
  import TextInput from "../../shared/TextInput.svelte";
  import type { GeneratedFileData } from "./types";
  const { formatAsHexString } = window.S4TK.formatting;

  export let entry: GeneratedFileData;

  let manualType = formatAsHexString(entry.manualKey.type, 8, false);
  let manualGroup = formatAsHexString(entry.manualKey.group, 8, false);
  let manualInst = formatAsHexString(entry.manualKey.instance, 16, false);

  function isValidHex(value: string, digits: number): boolean {
    const regex = new RegExp(`[0-9A-Fa-f]{${digits}}`, "g");
    return regex.test(value);
  }

  $: {
    if (
      isValidHex(manualType, 8) &&
      isValidHex(manualGroup, 8) &&
      isValidHex(manualInst, 16)
    ) {
      console.log("valid");
    } else {
      console.log("invalid");
    }
  }
</script>

<div class="flex-space-between flex-center-v">
  <p class="my-0 small-title nowrap">+ Manual Key</p>
  <div class="flex-center-v flex-end-h flex-gap flex-wrap">
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
</div>

<style lang="scss">
  // intentionally blank
</style>
