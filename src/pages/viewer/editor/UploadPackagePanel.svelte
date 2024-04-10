<script lang="ts">
  import ViewerState from "lib/viewer/viewer-state";
  import FileInput from "components/elements/FileInput.svelte";
  import SectionHeader from "components/elements/SectionHeader.svelte";
  import Modal from "components/layout/Modal.svelte";
  import ScanningPackageProgress from "./ScanningPackageProgress.svelte";
  const { Buffer } = window.NodeJS;

  let isParsingFiles = false;
  let filesInvalid = false;
  let fetchSampleError: string;

  async function handleFilesChanged(files: FileList) {
    if (files.length < 1) return;
    isParsingFiles = true;
    filesInvalid = false;
    const buffer = Buffer.from(await files[0].arrayBuffer());
    const filename = files[0].name;
    filesInvalid = !(await ViewerState.loadPackage(buffer, filename));
    isParsingFiles = false;
  }

  async function viewSamplePackage() {
    try {
      const res = await fetch("./assets/files/BrokenPackage.package");
      const arrayBuffer = await res.arrayBuffer();
      const buffer = window.NodeJS.Buffer.from(arrayBuffer);
      if (!(await ViewerState.loadPackage(buffer, "BrokenPackage.package")))
        throw "Failed to load package into viewer state.";
    } catch (e) {
      console.error(e);
      fetchSampleError = "Something went wrong. Please report this.";
    }
  }
</script>

<div class="flex justify-center items-center h-full w-full px-4">
  <div class="max-w-2xl">
    <SectionHeader title="Scan package for issues" />
    <div class="my-8">
      <p class="text-sm sm:text-base">
        Select a Sims 4 package file, and its contents (along with any issues)
        will be shown.
      </p>
      <p class="mt-1 text-xs text-subtle">
        A lack of issues does not mean everything is working; the scanner cannot
        check logic.
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
    <p class="mt-8 text-xs text-subtle">
      Just checking things out? View this error-laden <button
        class="text-secondary underline hover:no-underline"
        on:click={viewSamplePackage}>sample package</button
      >.
    </p>
    {#if fetchSampleError}
      <p class="mt-1 text-xs text-red-600 dark:text-red-400">
        {fetchSampleError}
      </p>
    {/if}
  </div>
</div>

{#if isParsingFiles}
  <Modal>
    <ScanningPackageProgress />
  </Modal>
{/if}
