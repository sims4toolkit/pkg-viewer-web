<script lang="ts">
  import JSZip from "jszip";
  import { saveAs } from "file-saver";
  import type {
    DdsImageResource,
    Package,
    SimDataResource,
    StringTableResource,
    XmlResource,
  } from "@s4tk/models";
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
      text: "ZIP (Rendered)",
      download: () => downloadZip(false),
    },
    {
      value: 2,
      text: "ZIP (Raw)",
      download: () => downloadZip(true),
    },
    {
      value: 3,
      text: "Current File (Rendered)",
      download: () => downloadCurrentFile(false),
    },
    {
      value: 4,
      text: "Current File (Raw)",
      download: () => downloadCurrentFile(true),
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

  async function downloadZip(raw: boolean) {
    const zip = new JSZip();

    for (let i = 0; i < pkg.size; ++i) {
      const entry = pkg.entries[i];
      const filename = getFilename(entry, raw);
      const content = await getFileContent(entry, raw);
      zip.file(filename, content);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, pkgName.replaceAll(".package", "") + ".zip");
  }

  async function downloadCurrentFile(raw: boolean) {
    const entry = pkg.entries[selectedIndex];
    const filename = getFilename(entry, raw);
    const content = await getFileContent(entry, raw);
    saveAs(new Blob([content]), filename);
  }

  async function getFileContent(
    entry: ResourceEntry,
    raw: boolean
  ): Promise<string | Buffer> {
    try {
      if (raw) return entry.value.getBuffer();

      switch (entry.value.encodingType) {
        case EncodingType.DATA:
          // DATA as XML
          return (entry.value as SimDataResource).toXmlDocument().toXml();
        case EncodingType.STBL:
          // STBL as JSON
          const stbl = (entry.value as StringTableResource).toJsonObject();
          return JSON.stringify(stbl, null, 2);
        case EncodingType.DDS:
          // DDS as PNG
          const image = (entry.value as DdsImageResource).image.toJimp();
          return await image.getBufferAsync("image/png");
        default:
          return entry.value.getBuffer();
      }
    } catch (e) {
      console.error(e);
      return "ERROR: This file is corrupt.";
    }
  }

  function getFilename(entry: ResourceEntry, raw: boolean): string {
    const parts = [formatResourceKey(entry.key, "!")];
    const name = getResourceName(entry);
    if (name) parts.push(name);
    parts.push(getExtension(entry, raw));
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

  function getExtension(entry: ResourceEntry, raw: boolean) {
    switch (entry.value.encodingType) {
      case EncodingType.DATA:
        return raw ? "simdata" : "SimData.xml";
      case EncodingType.STBL:
        return raw ? "stbl" : "json";
      case EncodingType.DDS:
        return raw ? "dds" : "png";
      default:
        return entry.value.isXml() ? "xml" : "binary";
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
