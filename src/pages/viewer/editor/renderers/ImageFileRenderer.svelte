<script lang="ts">
  import type { ImageFileInfo } from "lib/viewer/index-data-types";

  export let info: ImageFileInfo;
</script>

<div class="w-full h-full overflow-auto flex items-center justify-center">
  <div class="text-center">
    <img
      src={info.pngBase64}
      alt="Preview"
      class="max-w-full max-h-full border border-solid border-black dark:border-white"
    />
    {#if info.width && info.height}
      <p class="mt-2 text-subtle text-center text-sm">
        {info.width} x {info.height}
      </p>
    {/if}
  </div>
</div>
