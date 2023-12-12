<script lang="ts">
  import IconButton from "./elements/IconButton.svelte";
  import Select from "./elements/Select.svelte";
  import type { GlobalSettings } from "lib/generator/types";
  const { XmlDocumentNode } = window.S4TK.xml;

  export let globalSettings: GlobalSettings;
  let textareaValue = "";

  let selectedId = 0;
  $: templateOptions = globalSettings.templateData.templates.map((template) => {
    return {
      value: template.id,
      text: template.name,
    };
  });

  let selectedContentOption = 0;
  const contentOptions = [
    {
      value: 0,
      text: "Tuning",
    },
    {
      value: 1,
      text: "SimData",
    },
  ];

  $: currentTemplate = globalSettings.templateData.templates.find(
    (t) => t.id === selectedId
  );

  $: {
    selectedContentOption;
    if (currentTemplate) refreshContent();
  }

  function tryDefault<T>(fn: () => T, def: T): T {
    try {
      return fn();
    } catch (e) {
      return def;
    }
  }

  function refreshContent() {
    const xml =
      selectedContentOption === 0
        ? currentTemplate.tuning
        : currentTemplate.simdata;

    const formatted = tryDefault(
      () =>
        XmlDocumentNode.from(xml, {
          recycleNodes: true,
        }).toXml({ writeXmlDeclaration: false }),
      xml
    );

    textareaValue = formatted;
  }

  function updateTemplate() {
    const minified = tryDefault(
      () =>
        XmlDocumentNode.from(textareaValue, {
          recycleNodes: true,
        }).toXml({ minify: true, writeXmlDeclaration: false }),
      textareaValue
    );

    if (selectedContentOption === 0) {
      currentTemplate.tuning = minified;
    } else {
      currentTemplate.simdata = minified;
    }
  }

  function deleteTemplate() {
    if (
      confirm(
        `Do you really want to delete the template "${currentTemplate.name}"? This cannot be undone.`
      )
    ) {
      const index = globalSettings.templateData.templates.findIndex(
        (t) => t.id === selectedId
      );

      globalSettings.templateData.templates.splice(index, 1);
      selectedId = 0;
      globalSettings = globalSettings;
    }
  }

  function editTemplateName() {
    const name = prompt(
      `Enter a new name for the "${currentTemplate.name}" template. Names must be unique.`
    )?.trim();

    if (verifyNameAllowed(name)) {
      currentTemplate.name = name;
    }

    globalSettings = globalSettings;
  }

  function createNewTemplate() {
    const name = prompt(
      "Enter a name for your new template. Names must be unique."
    )?.trim();

    if (verifyNameAllowed(name)) {
      const id = globalSettings.templateData.nextId++;

      globalSettings.templateData.templates.push({
        id: id,
        name: name,
        tuning: "",
        simdata: "",
        locked: false,
      });

      globalSettings = globalSettings;
      selectedId = id;
    }
  }

  function verifyNameAllowed(name: string): boolean {
    if (name == undefined) return false;

    if (!name) {
      alert("Name cannot be empty.");
      return false;
    } else if (
      globalSettings.templateData.templates.some((t) => t.name === name)
    ) {
      alert(`Name "${name}" is already in use.`);
      return false;
    } else if (name.length > 50) {
      alert(`Name "${name}" is too long (must be <= 50 characters).`);
      return false;
    } else {
      return true;
    }
  }
</script>

{#if currentTemplate != undefined}
  <div class="flex flex-col gap-2">
    <div class="flex justify-between items-center">
      <div class="flex gap-2">
        <Select
          label="template"
          name="template-name-select"
          bind:selected={selectedId}
          options={templateOptions}
        />
        <Select
          label="content"
          name="template-content-select"
          bind:selected={selectedContentOption}
          options={contentOptions}
        />
      </div>
      <div class="flex gap-2">
        <IconButton
          icon="trash"
          active={!currentTemplate.locked}
          onClick={deleteTemplate}
          title="Delete Template"
          danger={true}
        />
        <IconButton
          icon="pencil"
          active={!currentTemplate.locked}
          onClick={editTemplateName}
          title="Edit Name"
        />
        <IconButton
          icon="plus"
          onClick={createNewTemplate}
          title="New Template"
        />
      </div>
    </div>
    <textarea
      class="monospace shadow-md bg-white dark:bg-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-500"
      bind:value={textareaValue}
      on:blur={updateTemplate}
      disabled={currentTemplate.locked}
      placeholder={selectedContentOption === 0
        ? "Enter tuning XML"
        : "Enter SimData XML"}
    />
    <p class="text-subtle text-sm">
      {#if currentTemplate.locked}
        This template is not editable.
      {:else}
        Paste in the XML content to use.
        {#if selectedContentOption === 0}
          Tuning must have a root node, or the site might go boom boom.
        {:else}
          SimData structure must be valid, or the site might go boom boom.
        {/if}
      {/if}
    </p>
  </div>
{/if}

<style lang="scss">
  textarea {
    resize: none;
    border-radius: 8px;
    padding: 8px;
    width: 100%;
    height: 350px;
    overflow-y: auto;
    overflow-x: auto;
    white-space: pre;
  }
</style>
