<script lang="ts">
  export let name: string;
  export let refs: string[];
</script>

<div class="ref-list">
  <h4 class="my-0 small-title">{name}</h4>
  <div class="ref-list-scroller p-half">
    {#if refs.length === 0}
      <p class="m-0">None</p>
    {:else}
      {#each refs as ref, key (key)}
        <p class="m-0">{ref}</p>
      {/each}
    {/if}
  </div>
</div>

<style lang="scss">
  .ref-list {
    flex: 1;
    max-width: 49%;

    .ref-list-scroller {
      background-color: var(--color-card-secondary);
      border-radius: 4px;
      overflow: auto;
      height: 65px;
    }
  }
</style>
