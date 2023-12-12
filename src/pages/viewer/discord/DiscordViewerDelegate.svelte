<script lang="ts">
  import { onMount } from "svelte";
  import config from "src/config";
  import ViewerState from "lib/viewer/viewer-state";
  import LoadingIndicator from "components/elements/LoadingIndicator.svelte";
  import PackageViewerPage from "../PackageViewerPage.svelte";
  import PlainTextViewer from "./PlainTextViewer.svelte";
  import HtmlViewer from "./HtmlViewer.svelte";

  export let params: {
    server: string;
    message: string;
    filename: string;
  };

  // don't use `at()` because Safari is dumb
  const lastItem = (arr: any[]) => arr[arr.length - 1];
  const extension = lastItem(params.filename?.split("."));
  $: fileIsPackage = extension === "package";
  $: fileIsHTML = extension === "html";

  let fetchedFileIsReady = false;
  let fetchedFileError: string;
  let plainTextContent: string;

  onMount(() => {
    const apiEndpoint = window.location.hash?.replace("#/", "");
    if (fileIsPackage) {
      fetchPackage(apiEndpoint);
    } else {
      fetchPlainText(apiEndpoint);
    }
  });

  async function fetchPackage(endpoint: string) {
    try {
      const res = await fetch(`${config.API_BASE}/${endpoint}`);
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        const buffer = window.NodeJS.Buffer.from(arrayBuffer);
        if (await ViewerState.loadPackage(buffer, params.filename)) {
          fetchedFileIsReady = true;
        } else {
          fetchedFileError = "Package is invalid or empty.";
          console.error(fetchedFileError);
        }
      } else {
        console.error(res);
        fetchedFileError = `[${res.status}] ${res.statusText}`;
      }
    } catch (e) {
      console.error(e);
      fetchedFileError = e instanceof Error ? e.message : e;
    }
  }

  async function fetchPlainText(endpoint: string) {
    try {
      const res = await fetch(`${config.API_BASE}/${endpoint}`);
      if (res.ok) {
        plainTextContent = await res.text();
        fetchedFileIsReady = true;
      } else {
        console.error(res);
        fetchedFileError = `[${res.status}] ${res.statusText}`;
      }
    } catch (e) {
      console.error(e);
      fetchedFileError = e instanceof Error ? e.message : e;
    }
  }
</script>

{#if fetchedFileIsReady}
  {#if fileIsPackage}
    <PackageViewerPage />
  {:else if fileIsHTML}
    <HtmlViewer content={plainTextContent} />
  {:else}
    <PlainTextViewer
      filename={params.filename}
      content={plainTextContent}
      {extension}
    />
  {/if}
{:else}
  <section class="pt-10 h-screen w-screen flex items-center justify-center">
    {#if Boolean(fetchedFileError)}
      <div class="text-center">
        <h2 class="mb-4 text-2xl font-bold">Error</h2>
        <p class="mb-8">{fetchedFileError}</p>
        <p class="text-sm text-subtle">
          Try refreshing the page. If it still isn't working, <a
            href="https://frankkmods.com/#/contact"
            target="_blank"
            rel="noreferrer"
            class="text-secondary">let me know</a
          >.
        </p>
      </div>
    {:else}
      <div class="text-center">
        <h2 class="mb-4 text-2xl font-bold">Hang Tight</h2>
        <p class="mb-4">
          Fetching {fileIsPackage ? "package" : "file"} from Discord
        </p>
        <LoadingIndicator />
      </div>
    {/if}
  </section>
{/if}
