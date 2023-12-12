<script lang="ts">
  import LoadingIndicator from "components/elements/LoadingIndicator.svelte";
</script>

<div
  class="bg-gray-100 dark:bg-gray-800 rounded-xl drop-shadow-md p-8 flex flex-col items-center gap-8"
>
  <div class="text-center">
    <h1 class="text-xl font-bold mb-2">Scanning Package</h1>
    <p class="text-xs text-subtle">
      This may take a bit. Don't close this tab.
    </p>
  </div>
  <div class="h-6">
    <LoadingIndicator />
  </div>
</div>
