<script lang="ts">
  import { link, location } from "svelte-spa-router";
  import Modal from "./layout/Modal.svelte";
  import SettingsMenu from "./settings/SettingsMenu.svelte";
  import { onDestroy } from "svelte";

  let settingsOpen = false;
  let currentLocation: string;

  const subscriptions = [
    location.subscribe((value) => {
      currentLocation = value;
    }),
  ];

  onDestroy(() => {
    subscriptions.forEach((unsub) => unsub());
  });

  $: titleSuffix =
    currentLocation === "/generate"
      ? "Generator"
      : currentLocation === "/view"
        ? "Viewer"
        : "Tools";
</script>

<nav
  class="fixed top-0 left-0 right-0 h-10 z-10 px-4 flex justify-between gap-4 bg-gray-200 dark:bg-gray-950 bottom-shadow"
>
  <a
    class="flex gap-2 items-center no-underline tint-on-hover whitespace-nowrap"
    href="/"
    use:link
  >
    <img src="./assets/s4tk-transparent.png" alt="S4TK" class="h-5" />
    <h2 class="font-bold">S4TK Package {titleSuffix}</h2>
  </a>
  <div class="flex gap-3 items-center">
    <button on:click={() => (settingsOpen = true)} title="Settings">
      <img
        src="./assets/icons/settings-outline.svg"
        alt="settings"
        class="svg tint-on-hover h-5"
      />
    </button>
  </div>
</nav>

{#if settingsOpen}
  <Modal>
    <SettingsMenu onClose={() => (settingsOpen = false)} />
  </Modal>
{/if}

<style lang="scss">
  nav {
    overflow: visible !important;
  }
</style>
