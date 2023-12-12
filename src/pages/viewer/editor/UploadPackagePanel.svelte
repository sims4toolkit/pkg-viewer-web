<script lang="ts">
  import ViewerState from "lib/viewer/viewer-state";
  import FileInput from "components/elements/FileInput.svelte";
  import SectionHeader from "components/elements/SectionHeader.svelte";
  import Modal from "components/layout/Modal.svelte";
  import ScanningPackageProgress from "./ScanningPackageProgress.svelte";
  const { Buffer } = window.NodeJS;

  let isParsingFiles = false;
  let filesInvalid = false;

  async function handleFilesChanged(files: FileList) {
    if (files.length < 1) return;
    isParsingFiles = true;
    filesInvalid = false;
    const buffer = Buffer.from(await files[0].arrayBuffer());
    const filename = files[0].name;
    filesInvalid = !(await ViewerState.loadPackage(buffer, filename));
    isParsingFiles = false;
  }
</script>

<div class="flex justify-center items-center h-full w-full px-4">
  <div class="max-w-2xl">
    <SectionHeader title="Scan package for issues" />
    <div class="my-8">
      <!-- TODO: use this when TDESC added back -->
      <!-- <p>
        Select a TS4 package file, and its contents will be shown. If any issues
        with meta data are found, they will be displayed. You can optionally run
        TDESC validation as well.
      </p> -->
      <p>
        Select a TS4 package file, and its contents will be shown. If any issues
        with meta data are found, they will be displayed. Note that TDESC
        validation is not yet available.
      </p>
      <p class="mt-1 text-xs text-subtle">
        A lack of warnings does not guarantee that everything is working; the
        scanner cannot check logic.
      </p>
    </div>
    <FileInput
      label="Upload a package"
      errorMessage="Not a valid package"
      onFilesChanged={handleFilesChanged}
      accept=".package"
      {filesInvalid}
      multiple={false}
    />
  </div>
</div>

{#if isParsingFiles}
  <Modal>
    <ScanningPackageProgress />
  </Modal>
{/if}
