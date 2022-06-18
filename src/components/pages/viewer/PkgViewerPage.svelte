<script lang="ts">
  import { onMount } from "svelte";
  import type { ResourceKey } from "@s4tk/models/lib/packages/types";
  import { navbarTextStore, navbarTitleType } from "../../../typescript/stores";
  import PrismWrapper from "../../layout/PrismWrapper.svelte";
  import MenuButton from "./MenuButton.svelte";
  import EntriesMenu from "./EntriesMenu.svelte";

  const { Package } = window.S4TK.models;
  const { Buffer } = window.S4TK.Node;
  const { BinaryResourceType, TuningResourceType, SimDataGroup } =
    window.S4TK.enums;
  const { formatAsHexString, formatResourceInstance } = window.S4TK.formatting;

  export let params: {
    server: string;
    message: string;
    filename: string;
  };

  let key: ResourceKey;
  let content: string = "";
  let showMenu = false;

  onMount(async () => {
    navbarTitleType.set("file");

    const res = await fetch(
      `http://localhost:3000/discord/${params.server}/${params.message}/${params.filename}`
    );

    if (res.ok) {
      const buffer = await res.arrayBuffer();
      const pkg = await Package.fromAsync(Buffer.from(buffer), {
        saveBuffer: true,
      });
      const entry = pkg.get(2);
      key = entry.key;
      content = entry.value.getBuffer().toString();
      console.log(content);
    } else {
      console.error("Ahhhh");
    }
  });

  $: {
    if (key) {
      navbarTextStore.set(
        `${getTypeDisplay(key.type, key.group)}, ${formatResourceInstance(
          key.instance
        )}`
      );
    }
  }

  function getTypeDisplay(type: number, group?: number): string {
    if (type === BinaryResourceType.SimData) {
      return group in SimDataGroup
        ? `${SimDataGroup[group].replace(/([A-Z])/g, " $1")} SimData`
        : "SimData";
    } else {
      return (
        BinaryResourceType[type] ??
        TuningResourceType[type] ??
        "Type " + formatAsHexString(type, 8, true)
      ).replace(/([A-Z])/g, " $1");
    }
  }

  function toggleMenu() {
    showMenu = !showMenu;
  }
</script>

<svelte:head>
  <title>Pkg...</title>
</svelte:head>

<section id="viewer-section">
  {#if content}
    {#if showMenu}
      <EntriesMenu onClose={toggleMenu} />
    {/if}
    <PrismWrapper>
      {content}
    </PrismWrapper>
  {/if}
</section>

{#if !showMenu}
  <MenuButton onClick={toggleMenu} />
{/if}

<style lang="scss">
  // intentionally blank
</style>
