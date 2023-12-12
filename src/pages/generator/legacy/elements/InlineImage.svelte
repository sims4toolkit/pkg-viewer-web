<script lang="ts">
  export let src: string;
  export let alt = src;
</script>

<img src="./assets/icons/{src}.svg" {alt} class="svg" />

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
