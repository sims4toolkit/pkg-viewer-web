<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  const MIN_LEFT_WIDTH = 196;
  const MAX_LEFT_RATIO = 0.8;

  let leftPanel: HTMLDivElement;
  let rightPanel: HTMLDivElement;
  let resizer: HTMLDivElement;
  let isResizing = false;

  onMount(() => {
    setPanelSizes(leftPanel.offsetWidth);
    window.addEventListener("resize", handleWindowResize);
  });

  onDestroy(() => {
    window.removeEventListener("resize", handleWindowResize);
  });

  function handleMouseDownOnResizer(e: MouseEvent) {
    isResizing = true;
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isResizing) return;
    setPanelSizes(e.clientX);
  }

  function handleMouseUp(e: MouseEvent) {
    isResizing = false;
  }

  function setPanelSizes(leftWidth: number) {
    const maxLeftWidth = MAX_LEFT_RATIO * window.innerWidth;
    leftWidth = Math.max(MIN_LEFT_WIDTH, Math.min(maxLeftWidth, leftWidth));
    leftPanel.style.width = `${leftWidth}px`;
    resizer.style.left = `${leftWidth}px`;
    rightPanel.style.left = `${leftWidth + 4}px`;
  }

  function handleWindowResize() {
    setPanelSizes(leftPanel.offsetWidth);
  }
</script>

<div
  class="w-full h-full relative split-view"
  class:is-resizing={isResizing}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
>
  <div
    bind:this={leftPanel}
    class="absolute top-0 bottom-0"
    style="width: 384px;"
  >
    <slot name="left" />
  </div>
  <div
    bind:this={resizer}
    class="absolute top-0 bottom-0 w-1 split-view-resizer bg-gray-100 dark:bg-gray-900"
    class:is-resizing={isResizing}
    style="left: 384px;"
    on:mousedown={handleMouseDownOnResizer}
  />
  <div
    bind:this={rightPanel}
    class="absolute top-0 bottom-0 right-0 overflow-hidden"
    style="left: 388px;"
  >
    <slot name="right" />
  </div>
</div>

<style lang="scss">
  .split-view.is-resizing {
    cursor: col-resize;
    user-select: none !important;
  }

  .split-view-resizer:hover,
  .split-view-resizer.is-resizing {
    cursor: col-resize;
    background-color: var(--color-accent) !important;
    transition: background-color 200ms ease-in;
  }
</style>
