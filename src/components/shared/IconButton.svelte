<script lang="ts">
  export let icon: string;
  export let onClick: () => void;
  export let active = true;
  export let title: string;
  export let small = false;
  export let noBorder = small;
  export let useBg = false;
  export let danger = false;
  export let round = true;

  let button: HTMLButtonElement;

  function onButtonClick() {
    if (active) {
      onClick();

      setTimeout(() => {
        button.blur();
      }, 100);
    }
  }
</script>

<button
  bind:this={button}
  class="flex-center-v"
  class:active
  class:small
  class:no-border={noBorder}
  class:use-bg={useBg}
  on:click={onButtonClick}
  class:danger-bg={danger}
  class:round
  {title}
  tabindex={active ? 0 : -1}
>
  <img class="is-svg" class:small src="./assets/{icon}.svg" alt={icon} />
</button>

<style lang="scss">
  button {
    background: none;
    border: 1px solid var(--color-divider);
    padding: 0.5em;
    border-radius: 4px;

    &.round {
      border-radius: 50%;
    }

    &.use-bg {
      background-color: var(--color-bg);
    }

    &.no-border {
      border: none !important;
    }

    &.small {
      padding: {
        left: 0.65em;
        right: 0.65em;
      }
    }

    img {
      height: 18px;
      width: auto;

      &.small {
        height: 14px;
      }
    }

    &.active:hover,
    &.active:focus {
      cursor: pointer;
      background-color: var(--color-accent-secondary);
      border-color: var(--color-accent-secondary);

      &.danger-bg {
        background-color: var(--color-error);
        border-color: var(--color-error);
      }

      img {
        filter: var(--filter-svg-invert);
      }
    }

    &:not(.active) {
      opacity: 0.65;

      &:hover {
        cursor: not-allowed;
      }
    }
  }
</style>
