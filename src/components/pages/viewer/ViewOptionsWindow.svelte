<script lang="ts">
  import type { Package, XmlResource } from "@s4tk/models";
  import type { EntryViewSettings } from "../../../global";
  import MovableWindow from "../../layout/MovableWindow.svelte";
  import Select from "../../shared/Select.svelte";
  import Button from "../../shared/Button.svelte";

  export let pkg: Package;
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

  async function formatXml() {
    try {
      // format XML
      pkg.entries.forEach((entry) => {
        if (entry.value.isXml()) {
          const xmlResource = entry.value as XmlResource;
          xmlResource.dom = xmlResource.dom;
        }
      });
    } catch (e) {
      console.error(e);
    }

    viewSettings.formattedXml = true;
    pkg = pkg;
  }
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
      text="Format XML"
      disabled={viewSettings.formattedXml}
      onClick={formatXml}
      fillWidth={true}
    />
  </div>
</MovableWindow>

<style lang="scss">
  // intentionally blank
</style>
