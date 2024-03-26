<script lang="ts">
  import type { ViewableFileInfo } from "lib/viewer/index-data-types";

  export let info: ViewableFileInfo;
  export let title: string;
  export let description: string;
</script>

<div class="absolute top-0 left-0 right-0 h-8 flex items-center pl-2">
  <p
    class="text-xs text-subtle whitespace-nowrap text-ellipsis overflow-hidden"
  >
    [{info.resourceKey}] {info.displayName}
  </p>
</div>
<div
  class="absolute top-8 bottom-0 left-0 right-0 p-2 flex items-center justify-center"
>
  <div class="text-center">
    <h2 class="mb-4 text-2xl font-bold text-subtle">{title}</h2>
    <p class="text-subtle">{description}</p>
  </div>
</div>
