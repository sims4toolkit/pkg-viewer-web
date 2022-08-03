<script lang="ts">
  import MovableWindow from "../../layout/MovableWindow.svelte";
  import Select from "../../shared/Select.svelte";
  import type { EntryViewSettings } from "../../../global";

  export let onClose: () => void;
  export let viewSettings: EntryViewSettings;

  const resourceKeyFormatOptions = [
    {
      value: 0,
      text: "Type/Group/Instance",
    },
    {
      value: 1,
      text: "Tuning ID",
    },
  ];
</script>

<MovableWindow title="Filter" {onClose}>
  <div>
    <Select
      label="resource key format"
      name="resource-key-format-view"
      bind:selected={viewSettings.resourceKeyFormat}
      options={resourceKeyFormatOptions}
      fillWidth={true}
    />
  </div>
</MovableWindow>

<style lang="scss">
  // intentionally blank
</style>
