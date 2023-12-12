<script lang="ts">
  export let title: string;
  export let subtitle: string;
  export let href: string;
  export let image: string;
</script>

<a {href} class="max-w-fit">
  <div class="up-on-hover relative top-0 text-white text-center w-full sm:w-80">
    <img
      src="./assets/screenshots/{image}"
      alt="Package Viewer"
      class="w-full h-full rounded-lg shadow-lg"
    />
    <div class="centered-in-relative">
      <h2 class="text-white font-bold text-2xl whitespace-nowrap">
        {title}
      </h2>
      <p class="text-white whitespace-nowrap mt-2">{subtitle}</p>
    </div>
  </div>
</a>

<style lang="scss">
  .centered-in-relative {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .up-on-hover {
    transition: top ease 200ms;

    &:hover {
      top: -4px;
    }
  }
</style>
