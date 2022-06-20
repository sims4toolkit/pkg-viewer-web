<script lang="ts">
  // This file is messy -- it was copied directly from the S4TK desktop app,
  // which was a POC. It works well enough, so whatever.

  export let leftPanelName: string;
  export const collapseLeftPanel = () => {
    leftIsCollapsed = true;
    updatePanelWidths(collapsedLeftWidth);
  };

  const navbarWidth = 0; // this is styled in Navbar
  const collapsedLeftWidth = 25; // this is styled in Navbar
  const leftCollapsePoint: number = 100;
  const defaultLeftWidth: number = 350; // default left width set in styling
  const maxLeftWidthPercent: number = 0.9;

  let resizer: HTMLElement;
  let leftPanel: HTMLElement;
  let rightPanel: HTMLElement;

  let isHoveringResizer: boolean = false;
  let showHighlight: boolean = false;
  let isResizing: boolean = false;
  let leftIsCollapsed: boolean = false;
  let resizePosition: number = defaultLeftWidth;
  $: useCursorR = isResizing && resizePosition <= leftCollapsePoint;

  function onMouseEnterResizer() {
    isHoveringResizer = true;
    setTimeout(() => {
      showHighlight = isHoveringResizer;
    }, 350);
  }

  function onMouseLeaveResizer() {
    isHoveringResizer = false;
    showHighlight = false;
  }

  function onMouseDownResizer() {
    isResizing = true;
    showHighlight = true;
  }

  function onMouseUp() {
    isResizing = false;
  }

  function onMouseMove(e: MouseEvent) {
    if (isResizing) {
      resizePosition = e.clientX - navbarWidth;
      if (leftIsCollapsed) {
        if (resizePosition > leftCollapsePoint) {
          leftIsCollapsed = false;
          updatePanelWidths(resizePosition);
        }
      } else {
        if (resizePosition >= leftCollapsePoint) {
          updatePanelWidths(resizePosition);
        } else if (resizePosition <= leftCollapsePoint) {
          leftIsCollapsed = true;
          updatePanelWidths(collapsedLeftWidth);
        }
      }
    }
  }

  function updatePanelWidths(leftPanelWidth: number) {
    const leftMaxWidth: number = Math.floor(
      (window.innerWidth - navbarWidth) * maxLeftWidthPercent
    );

    if (leftPanelWidth > leftMaxWidth) leftPanelWidth = leftMaxWidth;
    leftPanel.style.width = `${leftPanelWidth}px`;
    resizer.style.left = `${leftPanelWidth - 2}px`; // -2 comes from the offset set in styling
    rightPanel.style.left = `${leftPanelWidth + 2}px`; // + 2 comes from the offset set in styling
  }

  function expandLeftPanel() {
    leftIsCollapsed = false;
    updatePanelWidths(defaultLeftWidth);
  }
</script>

<div
  class="splitview"
  class:is-resizing={isResizing}
  class:cursor-r={useCursorR}
  on:mouseup={onMouseUp}
  on:mousemove={onMouseMove}
  on:mouseleave={onMouseUp}
>
  {#if leftIsCollapsed}
    <button
      class="button-wrapper collapsed-left-panel hoverable"
      draggable="false"
      on:click={expandLeftPanel}
    >
      <span>{leftPanelName}</span>
    </button>
  {/if}
  <div
    class="left-panel h-100"
    bind:this={leftPanel}
    hidden={leftIsCollapsed}
    class:prevent-interaction={isResizing}
  >
    <slot name="left" />
  </div>

  <div
    class="resizer"
    class:cursor-r={useCursorR || leftIsCollapsed}
    bind:this={resizer}
    on:mouseenter={onMouseEnterResizer}
    on:mouseleave={onMouseLeaveResizer}
    on:mousedown={onMouseDownResizer}
    class:highlight={showHighlight || isResizing}
  />

  <div
    class="right-panel"
    bind:this={rightPanel}
    class:prevent-interaction={isResizing}
  >
    <slot name="right" />
  </div>
</div>

<style lang="scss">
  $default-left-width: 350px;
  $resizer-width: 4px; // this is hardcoded in script
  $resizer-border: 2px;

  .splitview {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;

    &.is-resizing {
      cursor: col-resize;
    }

    .collapsed-left-panel,
    .left-panel,
    .right-panel,
    .resizer {
      position: absolute;
      top: 0;
      bottom: 0;
      overflow: hidden;
    }

    .collapsed-left-panel {
      width: 25px;
      background-color: var(--color-bg-secondary);
      font-size: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;

      span {
        writing-mode: vertical-lr;
        text-orientation: mixed;
        transform: rotate(-180deg);
        margin-top: 16px;
        opacity: 0.65;

        &:hover {
          cursor: pointer;
          opacity: 1;
        }
      }
    }

    .left-panel {
      left: 0;
      width: $default-left-width;
    }

    .right-panel {
      right: 0;
      left: $default-left-width + $resizer-border;
    }

    .resizer {
      left: $default-left-width - $resizer-width + $resizer-border;
      width: $resizer-width;
      box-sizing: border-box;
      cursor: col-resize;
      border-right: $resizer-border solid var(--color-bg-secondary);
      background-color: transparent;
      z-index: 512;

      &.highlight {
        border-right-color: var(--color-accent);
      }
    }
  }

  .cursor-r {
    cursor: e-resize !important;
  }

  .prevent-interaction {
    pointer-events: none;
    user-select: none;
  }
</style>
