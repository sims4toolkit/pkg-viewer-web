<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  export let text: string;
  export let visible: boolean;

  onMount(() => {
    setTimeout(() => {
      visible = false;
    }, 2000);
  });
</script>

<div
  class="fixed z-50 bottom-4 right-4 bg-gray-900 px-4 py-2 rounded"
  transition:fly={{ y: 20 }}
>
  <p class="text-white">{text}</p>
</div>
