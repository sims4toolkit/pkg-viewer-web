<script lang="ts">
  import MovableWindow from "../../layout/MovableWindow.svelte";
  import Select from "../../shared/Select.svelte";
  import type { EntryViewSettings } from "../../../global";
  import Button from "../../shared/Button.svelte";

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

<MovableWindow title="View Options" {onClose}>
  <div class="flex-col flex-gap">
    <Select
      label="resource key format"
      name="resource-key-format-view"
      bind:selected={viewSettings.resourceKeyFormat}
      options={resourceKeyFormatOptions}
      fillWidth={true}
    />
    <Button
      text="Restore Comments & Format XML"
      onClick={() => console.log("click")}
      fillWidth={true}
    />
  </div>
</MovableWindow>

<style lang="scss">
  // intentionally blank
</style>
