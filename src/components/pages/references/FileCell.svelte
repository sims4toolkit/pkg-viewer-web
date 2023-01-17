<script lang="ts">
  import ReferenceList from "./ReferenceList.svelte";
  import type { ExtractedXmlFile } from "./types";

  export let fileMap: Map<bigint, ExtractedXmlFile>;
  export let file: ExtractedXmlFile;

  $: referenceNames = file.references.map((ref) => fileMap.get(ref).filename);
  $: referencedByNames = file.referencedBy.map(
    (ref) => fileMap.get(ref).filename
  );
</script>

<div class="file-cell p-half">
  <p class="subtle-text my-0">{file.tuningId}</p>
  <h4 class="mt-0 mb-half">{file.filename}</h4>
  <div class="flex-space-between">
    <ReferenceList name="References" refs={referenceNames} />
    <ReferenceList name="Referenced By" refs={referencedByNames} />
  </div>
</div>

<style lang="scss">
  .file-cell {
    background-color: var(--color-card);
    border-radius: 4px;
    min-width: 600px;
    max-width: 100%;

    p {
      white-space: normal;
      overflow-wrap: break-word;
    }
  }
</style>
