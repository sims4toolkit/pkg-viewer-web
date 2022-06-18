<script lang="ts">
  import Router from "svelte-spa-router";
  import Navbar from "./components/Navbar.svelte";
  import Footer from "./components/Footer.svelte";
  import HomePage from "./components/pages/home/HomePage.svelte";
  import PkgViewerPage from "./components/pages/viewer/PkgViewerPage.svelte";
  import NotFoundPage from "./components/pages/NotFoundPage.svelte";

  const routes = {
    "/": HomePage,
    "/discord/:server/:message/:filename": PkgViewerPage,
    "*": NotFoundPage,
  };
</script>

<Navbar />
<main>
  <div class="main-content-wrapper">
    <Router {routes} restoreScrollState={true} />
  </div>
  <Footer />
</main>

<style lang="scss">
  main {
    .main-content-wrapper {
      min-height: 100vh;
    }
  }
</style>
