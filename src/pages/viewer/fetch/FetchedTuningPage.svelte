<script lang="ts">
  import { onMount } from "svelte";
  import config from "src/config";
  import PlainTextViewer from "../shared/PlainTextViewer.svelte";
  import Settings from "lib/utils/settings";
  import LoadingIndicator from "components/elements/LoadingIndicator.svelte";
  const { XmlResource } = window.S4TK.models;

  export let params: {
    instance: string;
  };

  let tuningLoaded = false;
  let loadError = false;

  let filename: string;
  let content: string;

  onMount(() => {
    fetch(`${config.TDESC_TUNING_API}/${params.instance}`)
      .then((res) => res.json())
      .then((json) => {
        const resource = new XmlResource(json.xml);
        filename = resource.root.name;
        content = resource.dom.toXml({
          spacesPerIndent: Settings.formatXmlSpaces,
        });
        tuningLoaded = true;
      })
      .catch((err) => {
        console.error(err);
        loadError = true;
      });
  });
</script>

{#if tuningLoaded}
  <PlainTextViewer {filename} {content} extension="xml" />
{:else}
  <section class="pt-10 h-screen w-screen flex items-center justify-center">
    {#if Boolean(loadError)}
      <div class="text-center">
        <h2 class="mb-4 text-2xl font-bold">Error</h2>
        <p>
          Something went wrong. Try searching on the
          <a href="https://tdesc.lot51.cc/" class="text-secondary"
            >TDESC Browser</a
          >.
        </p>
        <p class="mt-4 text-sm text-subtle">
          Go to <strong class="text-subtle">File</strong> &gt;
          <strong class="text-subtle">Import EA Tuning...</strong>
          and paste "<span class="monospace text-subtle">{params.instance}</span
          >" in the search box.
        </p>
      </div>
    {:else}
      <div class="text-center">
        <h2 class="mb-4 text-2xl font-bold">Hang Tight</h2>
        <p class="mb-4">Fetching file from the TDESC Browser...</p>
        <LoadingIndicator />
      </div>
    {/if}
  </section>
{/if}
