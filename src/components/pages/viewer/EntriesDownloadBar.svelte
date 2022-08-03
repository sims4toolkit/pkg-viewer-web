<script lang="ts">
  import JSZip from "jszip";
  import { saveAs } from "file-saver";
  import type { Package, SimDataResource, XmlResource } from "@s4tk/models";
  import type { ResourceEntry } from "@s4tk/models/types";
  import Select from "../../shared/Select.svelte";
  const { EncodingType, StringTableLocale } = window.S4TK.enums;
  const { formatResourceKey } = window.S4TK.formatting;

  export let pkgName: string;
  export let pkg: Package;
  export let selectedIndex: number;

  let selectedDownloadOption = 0;
  let isDownloading = false;

  const downloadOptions = [
    {
      value: 0,
      text: "Package",
      download: downloadPackage,
    },
    {
      value: 1,
      text: "ZIP",
      download: downloadZip,
    },
    {
      value: 2,
      text: "Current File",
      download: downloadCurrentFile,
    },
  ];

  //#region Functions

  async function downloadFiles() {
    try {
      isDownloading = true;
      await downloadOptions[selectedDownloadOption].download();
    } catch (e) {
      console.error(e);
    }

    isDownloading = false;
  }

  async function downloadPackage() {
    saveAs(new Blob([pkg.getBuffer()]), pkgName);
  }

  async function downloadZip() {
    const zip = new JSZip();

    pkg.entries.forEach((entry) => {
      const filename = getFilename(entry);
      const content = getFileContent(entry);
      zip.file(filename, content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, pkgName.replaceAll(".package", "") + ".zip");
  }

  async function downloadCurrentFile() {
    const entry = pkg.entries[selectedIndex];
    const filename = getFilename(entry);
    const content = getFileContent(entry);
    saveAs(new Blob([content]), filename);
  }

  function getFileContent(entry: ResourceEntry): string | Buffer {
    try {
      switch (entry.value.encodingType) {
        case EncodingType.DATA:
          return (entry.value as SimDataResource).toXmlDocument().toXml();
        default:
          return entry.value.getBuffer();
      }
    } catch (e) {
      console.error(e);
      return "ERROR: This file is corrupt.";
    }
  }

  function getFilename(entry: ResourceEntry): string {
    const parts = [formatResourceKey(entry.key, "!")];
    const name = getResourceName(entry);
    if (name) parts.push(name);
    parts.push(getExtension(entry));
    return parts.join(".");
  }

  function getResourceName(entry: ResourceEntry): string {
    try {
      switch (entry.value.encodingType) {
        case EncodingType.XML:
          return (entry.value as XmlResource).root.name;
        case EncodingType.STBL:
          return StringTableLocale[
            StringTableLocale.getLocale(entry.key.instance)
          ];
        case EncodingType.DATA:
          return (entry.value as SimDataResource).instance.name;
        default:
          return null;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  function getExtension(entry: ResourceEntry) {
    switch (entry.value.encodingType) {
      case EncodingType.DATA:
        return "SimData.xml";
      case EncodingType.Unknown:
        return "binary";
      default:
        return (
          EncodingType[entry.value.encodingType]?.toLowerCase() ?? "unknown"
        );
    }
  }

  //#endregion Functions
</script>

<div class="w-100 flex-center-v flex-space-between flex-gap-small">
  {#if isDownloading}
    <p class="subtle-text">Downloading...</p>
  {:else}
    <p class="subtle-text">Download:</p>
    <Select
      name="download-type-select"
      small={true}
      bind:selected={selectedDownloadOption}
      fillWidth={true}
      options={downloadOptions}
    />
    <button
      class="button-wrapper flex-center-v"
      on:click={downloadFiles}
      title="Download"
    >
      <img src="./assets/download.svg" class="is-svg" alt="Download" />
    </button>
  {/if}
</div>
