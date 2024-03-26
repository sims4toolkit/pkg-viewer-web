<script lang="ts">
  import type { StringTableFileInfo } from "lib/viewer/index-data-types";
  const { StringTableLocale } = window.S4TK.enums;
  const { formatStringKey } = window.S4TK.formatting;

  export let info: StringTableFileInfo;

  $: localeName = StringTableLocale[info.locale] ?? "Unknown";
  $: numEntries =
    info.entries.length === 1 ? "1 entry" : `${info.entries.length} entries`;
  $: displayName = `${localeName} String Table (${numEntries})`;
</script>

<div class="absolute top-0 left-0 right-0 h-8 flex items-center pl-2">
  <p
    class="text-xs text-subtle whitespace-nowrap text-ellipsis overflow-hidden"
  >
    {displayName}
  </p>
</div>
<div class="absolute top-8 bottom-0 left-0 right-0 overflow-y-auto p-2">
  <ul>
    {#each info.entries as entry}
      <li class="mb-3">
        <p class="inline monospace text-subtle text-sm">
          {formatStringKey(entry.key)}
        </p>
        <p class="inline text-sm">{entry.value}</p>
      </li>
    {/each}
  </ul>
</div>
