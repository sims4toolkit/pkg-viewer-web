<script lang="ts">
  import Router, { replace } from "svelte-spa-router";
  import HomePage from "./components/pages/HomePage.svelte";
  import Footer from "./components/Footer.svelte";
  import Navbar from "./components/Navbar.svelte";

  const routes = {
    "/": HomePage,
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
