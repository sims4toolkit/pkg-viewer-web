<script lang="ts">
  import { onMount } from "svelte";
  import { navbarTextStore, navbarTitleType } from "../../../typescript/stores";
  const { formatAsHexString, formatResourceInstance } = window.S4TK.formatting;
  const { BinaryResourceType, TuningResourceType, SimDataGroup } =
    window.S4TK.enums;

  export let params: {
    server: string;
    message: string;
    filename: string;
  };

  let key = {
    type: BinaryResourceType.SimData,
    group: SimDataGroup.PieMenuCategory,
    instance: 0x1234567890abcdefn,
  };

  onMount(async () => {
    navbarTitleType.set("file");

    const res = await fetch(
      `http://localhost:3000/discord/${params.server}/${params.message}/${params.filename}`
    );

    if (res.ok) {
      const buffer = await res.arrayBuffer();
      console.log(buffer);
    } else {
      console.error("Ahhhh");
    }
  });

  $: {
    navbarTextStore.set(
      `${getTypeDisplay(key.type, key.group)}, ${formatResourceInstance(
        key.instance
      )}`
    );
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
</script>

<svelte:head>
  <title>Pkg...</title>
</svelte:head>

<section id="viewer-section">
  <p>Testing: {params.filename}</p>
  <p>{getTypeDisplay(TuningResourceType.Trait)}</p>
  <p>{getTypeDisplay(BinaryResourceType.SimData, 1234)}</p>
  <p>
    {getTypeDisplay(BinaryResourceType.SimData, SimDataGroup.PieMenuCategory)}
  </p>
  <p>{getTypeDisplay(0x1234)}</p>
</section>

<style lang="scss">
  // intentionally blank
</style>
