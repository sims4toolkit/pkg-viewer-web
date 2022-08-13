<script lang="ts">
  import Router from "svelte-spa-router";
  import Navbar from "./components/Navbar.svelte";
  import HomePage from "./components/pages/home/HomePage.svelte";
  import NotFoundPage from "./components/pages/NotFoundPage.svelte";
  import HelpPage from "./components/pages/help/HelpPage.svelte";
  import PkgViewerUploaded from "./components/pages/viewer/PkgViewerUploaded.svelte";
  import DiscordDelegate from "./components/pages/viewer/DiscordDelegate.svelte";
  import PkgGeneratorPage from "./components/pages/generator/PkgGeneratorPage.svelte";

  const routes = {
    "/": HomePage,
    "/help": HelpPage,
    "/view": PkgViewerUploaded,
    "/generate": PkgGeneratorPage,
    "/discord/:server/:message/:filename": DiscordDelegate,
    "*": NotFoundPage,
  };
</script>

<Navbar />
<main>
  <div class="main-content-wrapper">
    <Router {routes} restoreScrollState={true} />
  </div>
</main>

<style lang="scss">
  main {
    .main-content-wrapper {
      min-height: 100vh;
    }
  }
</style>
