<script lang="ts">
  import Select from "../../shared/Select.svelte";
  import type { GeneratedFileEntryData, GlobalSettings } from "./types";

  export let globalSettings: GlobalSettings;
  export let entry: GeneratedFileEntryData;

  $: templateOptions = globalSettings.templateData.templates.map((template) => {
    return {
      value: template.id,
      text: template.name,
    };
  });
</script>

<div class="flex-space-between flex-center-v">
  <p class="my-0 small-title nowrap">+ Custom Template</p>
  <Select
    bind:selected={entry.templateId}
    options={templateOptions}
    small={true}
    name="custom-template-select-{entry.id}"
  />
</div>
