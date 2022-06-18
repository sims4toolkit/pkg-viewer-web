<script lang="ts">
  import { formatResourceKey } from "@s4tk/hashing/formatting";
  import type { SimDataResource, XmlResource } from "@s4tk/models";
  import { StringTableLocale } from "@s4tk/models/enums";
  import type { ResourceKeyPair } from "@s4tk/models/types";
  import { getTypeDisplay } from "../../../typescript/helpers";

  const { EncodingType } = window.S4TK.enums;

  export let onClick: () => void;
  export let entry: ResourceKeyPair;
  export let active: boolean;

  function getDisplayName() {
    switch (entry.value.encodingType) {
      case EncodingType.XML:
        return (entry.value as XmlResource).root.name;
      case EncodingType.DATA:
        return (entry.value as SimDataResource).instance.name;
      case EncodingType.STBL:
        const locale =
          StringTableLocale[StringTableLocale.getLocale(entry.key.instance)];
        return locale + " String Table";
      default:
        return "Unknown";
    }
  }
</script>

<button class="button-wrapper w-100 text-left" on:click={onClick}>
  <div class="entry-row p-half mb-half mr-half" class:active>
    <p class="mt-0 mb-half nowrap">{getDisplayName()}</p>
    <p class="small-title my-0 nowrap">
      {getTypeDisplay(entry.key.type, entry.key.group)}
    </p>
    <p class="small-title monospace my-0 nowrap">
      {formatResourceKey(entry.key)}
    </p>
  </div>
</button>

<style lang="scss">
  .entry-row {
    border-radius: 8px;
    overflow-x: hidden;
    border: 1px solid var(--color-bg-secondary);

    &.active {
      border-color: var(--color-text);
      background-color: var(--color-card);
    }

    &:not(.active):hover {
      cursor: pointer;
      background-color: var(--color-card);
    }
  }
</style>
