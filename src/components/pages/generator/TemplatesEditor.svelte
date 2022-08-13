<script lang="ts">
  import IconButton from "../../shared/IconButton.svelte";
  import Select from "../../shared/Select.svelte";
  import type { GlobalSettings } from "./types";
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
        }).toXml(),
      xml
    );

    textareaValue = formatted;
  }

  function updateTemplate() {
    const minified = tryDefault(
      () =>
        XmlDocumentNode.from(textareaValue, {
          recycleNodes: true,
        }).toXml({ minify: true }),
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
  <div class="flex-col flex-gap">
    <div class="flex flex-space-between flex-center-v">
      <div class="flex flex-gap">
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
      <div class="flex flex-gap-small">
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
      class="drop-shadow monospace"
      bind:value={textareaValue}
      on:blur={updateTemplate}
    />
  </div>
{/if}

<style lang="scss">
  textarea {
    resize: none;
    background-color: var(--color-bg-secondary);
    border-radius: 8px;
    padding: 8px;
    width: 100%;
    height: 300px;
    overflow-y: auto;
    overflow-x: auto;
    white-space: pre-wrap;
  }
</style>
