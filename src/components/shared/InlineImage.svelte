<script lang="ts">
  export let src: string;
  export let alt = src;
</script>

<img src="./assets/{src}.svg" {alt} class="is-svg" />

<style lang="scss">
  img {
    display: inline;
    height: 0.8em;
    margin: {
      left: 0.2em;
      right: 0.2em;
    }
  }
</style>
