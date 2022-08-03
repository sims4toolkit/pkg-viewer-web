<script lang="ts">
  import PkgViewerDiscord from "./PkgViewerDiscord.svelte";
  import TextViewerDiscord from "./TextViewerDiscord.svelte";

  export let params: {
    server: string;
    message: string;
    filename: string;
  };

  // don't use `at()` because Safari is dumb
  const lastItem = (arr: any[]) => arr[arr.length - 1];
  const extension = lastItem(params.filename?.split("."));
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
