<script lang="ts">
  import Button from "../../shared/Button.svelte";
  import IconButton from "../../shared/IconButton.svelte";
  import Select from "../../shared/Select.svelte";
  import type { XmlFileTemplateData } from "./types";
  const { XmlDocumentNode } = window.S4TK.xml;

  export let templateData: XmlFileTemplateData;
  let selectedId = 0;
  let selectedContentOption = 0;
  let formattedContent = "";

  $: templateOptions = templateData.templates.map((template) => {
    return {
      value: template.id,
      text: template.name,
    };
  });

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

  $: currentTemplate = templateData.templates.find((t) => t.id === selectedId);

  $: {
    if (currentTemplate) {
      formattedContent = formatXml(
        selectedContentOption === 0
          ? currentTemplate.tuning
          : currentTemplate.simdata
      );
    }
  }

  function formatXml(xml: string): string {
    return XmlDocumentNode.from(xml, {
      recycleNodes: true,
    }).toXml();
  }

  function updateTemplate() {
    currentTemplate.tuning = formattedContent;
  }

  function deleteTemplate() {
    if (
      confirm(
        `Do you really want to delete the template "${currentTemplate.name}"? This cannot be undone.`
      )
    ) {
      const index = templateData.templates.findIndex(
        (t) => t.id === selectedId
      );
      templateData.templates.splice(index, 1);
      selectedId = 0;
      templateData = templateData;
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
      const id = templateData.nextId++;

      templateData.templates.push({
        id: id,
        name: name,
        tuning: templateData.templates[0].tuning,
        simdata: templateData.templates[0].simdata,
        locked: false,
      });

      templateData = templateData;
      selectedId = id;
    }
  }

  function verifyNameAllowed(name: string): boolean {
    if (name == undefined) return false;

    if (!name) {
      alert("Name cannot be empty.");
      return false;
    } else if (templateData.templates.some((t) => t.name === name)) {
      alert(`Name "${name}" is already in use.`);
      return false;
    } else if (name.length > 30) {
      alert(`Name "${name}" is too long (must be <= 30 characters).`);
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
      bind:value={formattedContent}
      on:input={updateTemplate}
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
