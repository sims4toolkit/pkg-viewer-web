<script lang="ts">
  import Router from "svelte-spa-router";
  import Navbar from "./components/Navbar.svelte";
  import HomePage from "./components/pages/home/HomePage.svelte";
  import PkgViewerDiscord from "./components/pages/viewer/PkgViewerDiscord.svelte";
  import NotFoundPage from "./components/pages/NotFoundPage.svelte";
  import HelpPage from "./components/pages/help/HelpPage.svelte";
  import PkgViewerUploaded from "./components/pages/viewer/PkgViewerUploaded.svelte";

  const routes = {
    "/": HomePage,
    "/help": HelpPage,
    "/view": PkgViewerUploaded,
    "/discord/:server/:message/:filename": PkgViewerDiscord,
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
