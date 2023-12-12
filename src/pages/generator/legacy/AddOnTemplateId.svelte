<script lang="ts">
  import Select from "./elements/Select.svelte";
  import type {
    GeneratedFileEntryData,
    GlobalSettings,
  } from "lib/generator/types";

  export let globalSettings: GlobalSettings;
  export let entry: GeneratedFileEntryData;

  $: templateOptions = globalSettings.templateData.templates.map((template) => {
    return {
      value: template.id,
      text: template.name,
    };
  });
</script>

<div class="flex items-center justify-between">
  <p class="text-sm uppercase font-bold text-subtle whitespace-nowrap">
    + Custom Template
  </p>
  <Select
    bind:selected={entry.templateId}
    options={templateOptions}
    small={true}
    name="custom-template-select-{entry.id}"
  />
</div>
