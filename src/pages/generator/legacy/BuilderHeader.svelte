<script lang="ts">
  import type { GlobalSettings } from "lib/generator/types";
  import SectionHeader from "components/elements/SectionHeader.svelte";
  import TextInput from "./elements/TextInput.svelte";
  import Checkbox from "./elements/Checkbox.svelte";
  import Button from "./elements/Button.svelte";
  import BlurOverlay from "./elements/BlurOverlay.svelte";
  import TemplatesEditor from "./TemplatesEditor.svelte";

  export let globalSettings: GlobalSettings;

  let editingTemplates = false;
</script>

<div class="bg-gray-100 dark:bg-gray-900 py-10 w-full flex justify-center">
  <div
    class="w-full xl:max-w-screen-xl px-4 flex flex-col justify-center gap-4"
  >
    <div>
      <SectionHeader title="Legacy Tuning Generator" />
    </div>
    <p>
      This tool is for generating tuning/SimData files. <span
        class="text-red-600 dark:text-red-400"
        >It has now reached end of support, meaning I no longer maintain or
        provide support for it.</span
      >
      This is an incomplete tool, and a more fleshed-out alternative should be available
      in the
      <a
        href="https://vscode.sims4toolkit.com/"
        target="_blank"
        rel="noreferrer"
        class="text-secondary">S4TK VS Code extension</a
      > eventually.
    </p>
    <div>
      <p class="text-sm text-subtle uppercase font-bold mb-1">
        Global settings
      </p>
      <div class="flex items-center gap-4 flex-wrap">
        <TextInput
          name="filename-prefix-input"
          placeholder="Prefix file names with..."
          bind:value={globalSettings.filenamePrefix}
          fillWidth={true}
        />
        <Checkbox
          label="32-bit by default"
          bind:checked={globalSettings.all32bit}
        />
        <Checkbox
          label="High bit by default"
          bind:checked={globalSettings.allHighBit}
        />
        <Button
          text="Edit Templates"
          onClick={() => (editingTemplates = true)}
        />
      </div>
    </div>
  </div>
</div>

{#if editingTemplates}
  <BlurOverlay onClose={() => (editingTemplates = false)}>
    <TemplatesEditor bind:globalSettings />
  </BlurOverlay>
{/if}
