<script lang="ts">
  import InlineImage from "./elements/InlineImage.svelte";
</script>

<div class="flex flex-col items-center gap-4">
  <h2 class="text-center text-lg font-bold">This package is empty</h2>
  <p class="text-subtle text-center">
    Add an entry with the <InlineImage src="plus" /> button or
    <mark class="key">ctrl/cmd</mark>
    +
    <mark class="key">n</mark>.
  </p>
  <p class="text-subtle text-center">
    Clone the last entry with the <InlineImage src="duplicate" /> button or
    <mark class="key">ctrl/cmd</mark>
    +
    <mark class="key">m</mark>.
  </p>
  <p class="text-subtle text-center">
    Build the package with the <span class="monospace text-sm"
      ><InlineImage src="hammer" />Build</span
    >
    button or <mark class="key">ctrl/cmd</mark>
    +
    <mark class="key">b</mark>.
  </p>
</div>

<style lang="scss">
  mark.key {
    color: var(--color-text);
    border: 1px solid var(--color-text);
    background-color: transparent;
    border-radius: 2px;
    text-transform: uppercase;
    font-family: var(--font-mono), monospace;
    font-size: 0.8em;
    padding: {
      left: 0.35em;
      right: 0.35em;
    }
  }
</style>
