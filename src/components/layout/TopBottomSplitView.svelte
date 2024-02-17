<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  const NAVBAR_HEIGHT = 40;
  const MIN_BOTTOM_HEIGHT = 40;
  const MAX_BOTTOM_RATIO = 0.6;

  export let bottomIsCollapsed: boolean = null;

  let bottomPanel: HTMLDivElement;
  let topPanel: HTMLDivElement;
  let resizer: HTMLDivElement;
  let isResizing = false;
  let mounted = false;

  $: {
    bottomIsCollapsed;
    toggleBottomPanel();
  }

  onMount(() => {
    setPanelSizes(bottomPanel.offsetHeight);
    window.addEventListener("resize", handleWindowResize);
    mounted = true;
  });

  onDestroy(() => {
    window.removeEventListener("resize", handleWindowResize);
  });

  function handleMouseDownOnResizer(e: MouseEvent) {
    isResizing = true;
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isResizing) return;
    setPanelSizes(window.innerHeight - e.clientY);
  }

  function handleMouseUp(e: MouseEvent) {
    isResizing = false;
  }

  function setPanelSizes(bottomHeight: number) {
    const maxBottomHeight =
      MAX_BOTTOM_RATIO * (window.innerHeight - NAVBAR_HEIGHT);
    bottomHeight = Math.max(
      MIN_BOTTOM_HEIGHT,
      Math.min(maxBottomHeight, bottomHeight)
    );
    bottomPanel.style.height = `${bottomHeight}px`;
    resizer.style.bottom = `${bottomHeight}px`;
    topPanel.style.bottom = `${bottomHeight + 4}px`;
    if (!bottomIsCollapsed && bottomHeight < 48) {
      bottomIsCollapsed = true;
    } else if (bottomIsCollapsed && bottomHeight > 192) {
      bottomIsCollapsed = false;
    }
  }

  function handleWindowResize() {
    setPanelSizes(bottomPanel.offsetHeight);
  }

  function toggleBottomPanel() {
    if (!mounted || bottomIsCollapsed == null) return;
    if (bottomIsCollapsed) {
      setPanelSizes(MIN_BOTTOM_HEIGHT);
    } else {
      setPanelSizes(192); // from default height
    }
  }
</script>

<div
  class="w-full h-full relative split-view"
  class:is-resizing={isResizing}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
>
  <div
    bind:this={topPanel}
    class="absolute top-0 left-0 right-0"
    style="bottom: 196px;"
  >
    <slot name="top" />
  </div>
  <div
    bind:this={resizer}
    class="absolute left-0 right-0 h-1 split-view-resizer border-b border-solid border-b-gray-300 dark:border-b-gray-700"
    class:is-resizing={isResizing}
    style="bottom: 192px;"
    on:mousedown={handleMouseDownOnResizer}
  />
  <div
    bind:this={bottomPanel}
    class="absolute left-0 bottom-0 right-0 overflow-hidden"
    style="height: 192px;"
  >
    <slot name="bottom" />
  </div>
</div>

<style lang="scss">
  .split-view.is-resizing {
    cursor: row-resize;
    user-select: none !important;
  }

  .split-view-resizer:hover,
  .split-view-resizer.is-resizing {
    cursor: row-resize;
    background-color: var(--color-accent) !important;
    transition: background-color 200ms ease-in;
  }
</style>
