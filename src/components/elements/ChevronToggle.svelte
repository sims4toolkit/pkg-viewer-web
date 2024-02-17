<script lang="ts">
  export let isCollapsed: boolean;

  $: title = isCollapsed ? "Expand" : "Collapse";
  $: chevronDirection = isCollapsed ? "up" : "down";

  function toggleCollapse() {
    isCollapsed = !isCollapsed;
  }
</script>

<button {title} on:click={toggleCollapse}
  ><img
    src="./assets/icons/chevron-{chevronDirection}.svg"
    alt="clear"
    class="svg h-4 w-4"
  /></button
>
