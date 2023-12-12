<script lang="ts">
  import Router from "svelte-spa-router";
  import Navbar from "components/Navbar.svelte";
  import HomePage from "pages/home/HomePage.svelte";
  import NotFoundPage from "pages/NotFoundPage.svelte";
  import PackageViewerPage from "pages/viewer/PackageViewerPage.svelte";
  import PackageGeneratorDelegate from "pages/generator/PackageGeneratorDelegate.svelte";
  import DiscordViewerDelegate from "pages/viewer/discord/DiscordViewerDelegate.svelte";

  const routes = {
    "/": HomePage,
    "/view": PackageViewerPage,
    "/generate": PackageGeneratorDelegate,
    "/discord/:server/:message/:filename": DiscordViewerDelegate,
    "*": NotFoundPage,
  };
</script>

<Navbar />
<main class="min-h-screen flex flex-col">
  <Router {routes} restoreScrollState={true} />
</main>
