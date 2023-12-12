<script lang="ts">
  import TextInput from "./elements/TextInput.svelte";
  import type { GeneratedFileEntryData } from "lib/generator/types";
  const { formatAsHexString } = window.S4TK.formatting;

  export let entry: GeneratedFileEntryData;

  let manualType = formatAsHexString(entry.manualKey.type, 8, false);
  let manualGroup = formatAsHexString(entry.manualKey.group, 8, false);
  let manualInst = formatAsHexString(entry.manualKey.instance, 16, false);

  function isValidHex(value: string, digits: number): boolean {
    const regex = new RegExp(`^[0-9A-Fa-f]{${digits}}$`);
    return regex.test(value);
  }

  $: typeIsValid = isValidHex(manualType, 8);
  $: groupIsValid = isValidHex(manualGroup, 8);
  $: instIsValid = isValidHex(manualInst, 16);
  $: entriesAreValid = typeIsValid && groupIsValid && instIsValid;
</script>

<div class="flex justify-between items-center">
  <p class="whitespace-nowrap text-sm font-bold text-subtle uppercase">
    + Manual Key
    {#if !entriesAreValid}
      <span class="text-red-600 dark:text-red-400">• Key is invalid</span>
    {/if}
  </p>
  <div class="flex flex-wrap justify-center items-end gap-4">
    <TextInput
      name="manual-type-input-{entry.id}"
      placeholder="Type"
      monospace={true}
      bind:value={manualType}
      bind:isValid={typeIsValid}
    />
    <TextInput
      name="manual-group-input-{entry.id}"
      placeholder="Group"
      monospace={true}
      bind:value={manualGroup}
      bind:isValid={groupIsValid}
    />
    <TextInput
      name="manual-inst-input-{entry.id}"
      placeholder="Instance"
      monospace={true}
      bind:value={manualInst}
      bind:isValid={instIsValid}
    />
  </div>
</div>
