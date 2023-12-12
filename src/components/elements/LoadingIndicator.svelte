<div class="loading-indicator">
  <div />
  <div />
  <div />
  <div />
</div>

<style lang="scss">
  .loading-indicator {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 13px;

    div {
      position: absolute;
      top: 0px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: var(--color-text);
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }

    div:nth-child(1) {
      left: 8px;
      animation: loading-indicator1 0.6s infinite;
    }

    div:nth-child(2) {
      left: 8px;
      animation: loading-indicator2 0.6s infinite;
    }

    div:nth-child(3) {
      left: 32px;
      animation: loading-indicator2 0.6s infinite;
    }

    div:nth-child(4) {
      left: 56px;
      animation: loading-indicator3 0.6s infinite;
    }
  }

  @keyframes loading-indicator1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes loading-indicator2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }

  @keyframes loading-indicator3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
</style>
