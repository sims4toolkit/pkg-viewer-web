<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import { subscribeToKey } from "lib/utils/keybindings";
  import StickyCloseButton from "./StickyCloseButton.svelte";

  export let large = false;
  export let fill = true;
  export let onClose: () => void = () => {};

  let modal: HTMLDivElement;
  let firstFocusableChild: Element;
  let lastFocusableChild: Element;

  const bodyClassName = "overlay-active";
  const focusQuery = "a, button, input, textarea, select";
  const keySubscriptions = [subscribeToKey("Escape", onClose)];

  onMount(() => {
    document.body.classList.add(bodyClassName);
    resetChildrenRefs();
    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);
  });

  onDestroy(() => {
    document.body.classList.remove(bodyClassName);
    window.removeEventListener("focusin", onFocusIn);
    window.removeEventListener("focusout", onFocusOut);
    keySubscriptions.forEach((unsubscribe) => unsubscribe());
  });

  function resetChildrenRefs() {
    const focusableChildren = modal.querySelectorAll(focusQuery);
    firstFocusableChild = focusableChildren[0];
    lastFocusableChild = focusableChildren[focusableChildren.length - 1];
  }

  function focusOnFirstChild() {
    if (!document.contains(firstFocusableChild)) resetChildrenRefs();
    //@ts-ignore I do know why it's being annoying about this one...
    firstFocusableChild?.focus();
  }

  function focusOnLastChild() {
    if (!document.contains(lastFocusableChild)) resetChildrenRefs();
    //@ts-ignore I do know why it's being annoying about this one...
    lastFocusableChild?.focus();
  }

  function onFocusOut(e: FocusEvent) {
    //@ts-ignore Idk why TS is being annoying about this...
    if (!modal.contains(e.relatedTarget)) {
      if (lastFocusableChild === e.target) {
        focusOnFirstChild();
      } else if (firstFocusableChild === e.target) {
        focusOnLastChild();
      }
    }
  }

  function onFocusIn(e: FocusEvent) {
    //@ts-ignore Idk why TS is being annoying about this...
    if (!modal.contains(e.target)) focusOnFirstChild();
  }
</script>

<div bind:this={modal} class="overlay blurred-bg" transition:fade>
  <div class="popup" class:large class:fill>
    <div>
      <slot />
    </div>
  </div>
  {#if onClose != undefined}
    <StickyCloseButton onClick={onClose} />
  {/if}
</div>

<style lang="scss">
  .overlay {
    z-index: 4096;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .popup {
      max-width: 768px;
      padding: 1em;

      &.large {
        max-width: 1280px;
      }

      &.fill {
        width: 100%;
      }
    }
  }
</style>
