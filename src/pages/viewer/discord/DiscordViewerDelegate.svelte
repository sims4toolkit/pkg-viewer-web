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
  let fetchedFileErrorCode: string;
  let fetchedFileErrorMessage: string;
  let plainTextContent: string;
  $: hasError = Boolean(fetchedFileErrorCode || fetchedFileErrorMessage);

  onMount(() => {
    const apiEndpoint = window.location.hash?.replace("#/", "");
    if (fileIsPackage) {
      fetchPackage(apiEndpoint);
    } else {
      fetchPlainText(apiEndpoint);
    }
  });

  async function fetchPackage(endpoint: string) {
    safeFetch(endpoint, async (res) => {
      const arrayBuffer = await res.arrayBuffer();
      const buffer = window.NodeJS.Buffer.from(arrayBuffer);
      if (await ViewerState.loadPackage(buffer, params.filename)) {
        fetchedFileIsReady = true;
      } else {
        fetchedFileErrorMessage = "Package is invalid or empty.";
      }
    });
  }

  async function fetchPlainText(endpoint: string) {
    safeFetch(endpoint, async (res) => {
      plainTextContent = await res.text();
      fetchedFileIsReady = true;
    });
  }

  async function safeFetch(endpoint: string, onOk: (res: Response) => void) {
    try {
      const res = await fetch(`${config.DISCORD_API}/${endpoint}`);
      if (res.ok) {
        onOk(res);
      } else {
        console.error(res);
        fetchedFileErrorCode = res.status.toString();
        fetchedFileErrorMessage = await res.text();
      }
    } catch (e) {
      console.error(e);
      fetchedFileErrorMessage = e instanceof Error ? e.message : e;
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
    {#if Boolean(hasError)}
      <div class="text-center">
        <h2 class="mb-4 text-2xl font-bold">Error {fetchedFileErrorCode}</h2>
        <p class="mb-8">{fetchedFileErrorMessage}</p>
        <p class="text-sm text-subtle">
          Not sure why you're seeing this error? <a
            href="https://frankkmods.com/#/contact"
            target="_blank"
            rel="noreferrer"
            class="text-secondary">Contact me</a
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
