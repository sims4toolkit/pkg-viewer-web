<script lang="ts">
  import type { XmlResource } from "@s4tk/models";
  import Footer from "../../Footer.svelte";
  import ContentArea from "../../layout/ContentArea.svelte";
  import FileInput from "../../shared/FileInput.svelte";
  import SectionHeader from "../../shared/SectionHeader.svelte";
  import FileCell from "./FileCell.svelte";
  const { Package } = window.S4TK.models;
  const { TuningResourceType } = window.S4TK.enums;
  const { XmlDocumentNode } = window.S4TK.xml;
  const { Buffer } = window.S4TK.Node;

  interface ExtractedXmlFile {
    tuningId: bigint;
    filename: string;
    content: string;
    references: bigint[];
    referencedBy: bigint[];
  }

  const fileMap = new Map<bigint, ExtractedXmlFile>();
  let files: FileList;
  let filesParsed = false;
  let indexedFiles: {
    tuningId: bigint;
    filename: string;
    references: bigint[];
    referencedBy: bigint[];
  }[];

  $: {
    if (files?.length > 0) {
      setTimeout(parseFiles, 100);
    }
  }

  async function parseFiles() {
    filesParsed = false;
    fileMap.clear();
    indexedFiles = [];

    for (let i = 0; i < files.length; ++i) {
      try {
        const file = files[i];
        const lowerName = file.name.toLowerCase();

        if (lowerName.endsWith("xml")) {
          const arrayBuffer = await file.arrayBuffer();
          const content = Buffer.from(arrayBuffer).toString();
          const xml = XmlDocumentNode.from(content);
          const tuningId = BigInt(xml.child.attributes["s"]);
          const filename = xml.child.attributes["n"];
          fileMap.set(tuningId, {
            tuningId,
            filename,
            content,
            references: [],
            referencedBy: [],
          });
        } else if (lowerName.endsWith("package")) {
          const arrayBuffer = await file.arrayBuffer();

          const pkg = Package.from<XmlResource>(Buffer.from(arrayBuffer), {
            resourceFilter: (type) => type in TuningResourceType,
          });

          pkg.entries.forEach(({ key, resource }) => {
            fileMap.set(key.instance, {
              tuningId: key.instance,
              filename: resource.root.name,
              content: resource.content,
              references: [],
              referencedBy: [],
            });
          });
        }
      } catch (err) {
        // TODO:
        console.error(err);
      }
    }

    const allTuningIds = [...fileMap.keys()];
    fileMap.forEach((extractedFile) => {
      extractedFile.references = allTuningIds.filter((id) => {
        const regex = new RegExp(`>\s*${id}\s*<`);
        return regex.test(extractedFile.content);
      });

      extractedFile.references.forEach((ref) => {
        fileMap.get(ref)?.referencedBy.push(extractedFile.tuningId);
      });

      indexedFiles.push(extractedFile);
    });

    indexedFiles = indexedFiles;
    filesParsed = true;
  }
</script>

<svelte:head>
  <title>Reference Finder</title>
</svelte:head>

<section id="references-page" class="flex-col flex-space-between">
  {#if Boolean(files)}
    {#if filesParsed}
      <div class="files-wrapper p-half">
        {#each indexedFiles as file, key (key)}
          <FileCell {file} {fileMap} />
        {/each}
      </div>
    {:else}
      <p>Parsing and indexing your {files.length} file(s)...</p>
    {/if}
  {:else}
    <ContentArea>
      <SectionHeader title="View file relationships" />
      <p class="my-2">
        Upload as many packages and XML files as you want, and the relationships
        between your tuning files will be visualized.
      </p>
      <FileInput
        accept=".package,.xml"
        label="Upload Files to Index"
        multiple={true}
        errorMessage="No tuning files found"
        bind:files
      />
    </ContentArea>
    <Footer />
  {/if}
</section>

<style lang="scss">
  .files-wrapper {
    display: grid;
    gap: 1em;
    grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  }
</style>
