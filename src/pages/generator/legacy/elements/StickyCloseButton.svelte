<script lang="ts">
  import { fade } from "svelte/transition";

  export let onClick: () => void;
</script>

<button on:click={onClick} transition:fade>
  <img class="svg" src="./assets/icons/x.svg" alt="X" />
</button>

<style lang="scss">
  button {
    position: fixed;
    z-index: 4096;
    top: 25px;
    right: 25px;
    width: 40px;
    height: 40px;

    img {
      width: 100%;
      height: 100%;

      &:hover {
        cursor: pointer;
        opacity: 0.65;
      }
    }
  }
</style>
