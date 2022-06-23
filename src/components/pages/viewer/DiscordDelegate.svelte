<script lang="ts">
  import PkgViewerDiscord from "./PkgViewerDiscord.svelte";
  import TextViewerDiscord from "./TextViewerDiscord.svelte";

  export let params: {
    server: string;
    message: string;
    filename: string;
  };

  const extension = params.filename?.split(".").at(-1);
</script>

<svelte:head>
  <title>{params.filename}</title>
</svelte:head>

{#if extension === "package"}
  <PkgViewerDiscord {params} />
{:else}
  <TextViewerDiscord {params} {extension} />
{/if}

<style lang="scss">
  // intentionally blank
</style>
