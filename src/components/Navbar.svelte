<script lang="ts">
  import { link, location } from "svelte-spa-router";
  import ThemeToggler from "./shared/ThemeToggler.svelte";

  $: homeIcon = $location === "/" ? "home" : "home-outline";
  $: helpIcon = $location === "/help" ? "help-circle" : "help-circle-outline";
</script>

<nav class="flex-center-v flex-space-between bottom-shadow">
  <div class="left flex-center-v flex-space-between">
    <a href="/" use:link class="flex-center-v flex-space-between">
      <img src="../assets/s4tk-transparent.png" alt="S4TK" />
      <h3 class="m-0">S4TK Packages</h3>
    </a>
  </div>
  <div class="right flex-center-v flex-space-between">
    <a href="/" class:active={$location === "/"} use:link title="Home">
      <img class="is-svg smaller" src="./assets/{homeIcon}.svg" alt="Home" />
    </a>
    <a href="/help" class:active={$location === "/help"} use:link title="Help">
      <img class="is-svg" src="./assets/{helpIcon}.svg" alt="Help" />
    </a>
    <ThemeToggler />
  </div>
</nav>

<style lang="scss">
  $navbar-height: 50px;

  nav {
    background-color: var(--color-navbar);
    padding: 0 1em;
    position: fixed;
    top: 0;
    width: 100%;
    height: $navbar-height;
    z-index: 1024;
    white-space: nowrap;
    backdrop-filter: blur(6px);
    overflow-x: auto;
    -webkit-backdrop-filter: blur(6px);

    div.left {
      margin-right: 2em;

      img {
        width: auto;
        height: 1.5em;
        margin-right: 10px;
      }
    }

    div.right {
      img {
        height: 24px;
        width: auto;
        margin-top: 4px;

        &.smaller {
          height: 20px;
        }
      }
    }

    a {
      color: var(--color-text);
      text-decoration: none;

      &:not(:last-child) {
        margin-right: 1em;
      }

      &:hover:not(.active) {
        opacity: 0.65;
      }

      &.active {
        pointer-events: none;
      }
    }
  }

  :global(.below-navbar) {
    margin-top: $navbar-height;
  }
</style>
