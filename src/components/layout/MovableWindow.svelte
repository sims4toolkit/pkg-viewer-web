<script lang="ts">
  import { onMount } from "svelte";

  export let title: string;
  export let onClose: () => void;

  let movableWindow: HTMLDivElement;
  let movableWindowHeader: HTMLDivElement;

  function enableDragging() {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;

    movableWindowHeader.onmousedown = dragMouseDown;

    function dragMouseDown(e: any) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e: any) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      movableWindow.style.top = movableWindow.offsetTop - pos2 + "px";
      movableWindow.style.left = movableWindow.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;

      if (movableWindow.offsetTop < 0) movableWindow.style.top = "10px";
      else if (
        movableWindow.offsetTop >
        window.innerHeight - movableWindow.offsetHeight - 10
      )
        movableWindow.style.top =
          window.innerHeight - movableWindow.offsetHeight - 10 + "px";

      if (movableWindow.offsetLeft < 0) movableWindow.style.left = "10px";
      else if (
        movableWindow.offsetLeft >
        window.innerWidth - movableWindow.offsetWidth - 10
      )
        movableWindow.style.left =
          window.innerWidth - movableWindow.offsetWidth - 10 + "px";
    }
  }

  onMount(enableDragging);
</script>

<div bind:this={movableWindow} class="movable-window drop-shadow">
  <div
    bind:this={movableWindowHeader}
    class="movable-window-header flex-space-between flex-center-v p-half grabbable"
  >
    <p class="my-0 small-title unselectable-text">{title}</p>
    <button class="button-wrapper" on:click={onClose}>
      <img src="./assets/x.svg" class="is-svg" alt="Close" />
    </button>
  </div>
  <div class="p-half window-content">
    <slot />
  </div>
</div>

<style lang="scss">
  .movable-window {
    z-index: 1024;
    position: fixed;
    width: 360px;
    height: 400px;
    right: 20px;
    bottom: 20px;
    background-color: var(--color-card);
    border: 1px solid var(--color-bg-secondary);
    border-radius: 4px;

    .window-content {
      overflow-y: auto;
      max-width: 100%;
      overflow-x: hidden;
      max-height: 360px;
    }

    .movable-window-header {
      background-color: var(--color-card-secondary);
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;

      img {
        height: 1em;
      }
    }
  }
</style>
