<script lang="ts">
  import { link, location } from "svelte-spa-router";
  import { navbarTextStore, navbarTitleType } from "../typescript/stores";
  import ThemeToggler from "./shared/ThemeToggler.svelte";

  let navbarText = "";
  let navbarClass: "home" | "file" = "home";

  // $: settingsIcon = $location === "/settings" ? "settings" : "settings-outline";
  $: homeIcon = $location === "/" ? "home" : "home-outline";

  navbarTextStore.subscribe((value) => {
    navbarText = value;
  });

  navbarTitleType.subscribe((value) => {
    navbarClass = value;
  });
</script>

<nav class="flex-center-v flex-space-between bottom-shadow">
  <div class="left flex-center-v flex-space-between">
    {#if navbarClass === "home"}
      <div class="flex-center-v flex-space-between">
        <img src="../assets/s4tk-transparent.png" alt="Sims 4 Toolkit Icon" />
        <h3 class="m-0">{navbarText}</h3>
      </div>
    {:else}
      <h3 class="m-0">{navbarText}</h3>
    {/if}
  </div>
  <div class="right flex-center-v flex-space-between">
    <a href="/" class:active={$location === "/"} use:link title="Home">
      <img
        class="is-svg ionicon-img"
        src="./assets/{homeIcon}.svg"
        alt="Home"
      />
    </a>
    <!-- <a
      href="/settings"
      class:active={$location === "/settings"}
      use:link
      title="Settings"
    >
      <img
        class="is-svg ionicon-img"
        src="./assets/{settingsIcon}.svg"
        alt="Settings"
      />
    </a> -->
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

        &.ionicon-img {
          padding: 2px;
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
