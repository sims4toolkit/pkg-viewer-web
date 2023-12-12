<script lang="ts">
  import Settings from "lib/utils/settings";

  // redundant so icon can react without accessing settings
  let isLightTheme = Settings.isLightTheme;

  function toggleTheme() {
    Settings.isLightTheme = !Settings.isLightTheme;
    isLightTheme = Settings.isLightTheme;
  }
</script>

<button on:click={toggleTheme} title="Toggle Theme" class="tint-on-hover">
  <img
    src="./assets/icons/{isLightTheme ? 'sunny' : 'moon'}-outline.svg"
    alt={isLightTheme ? "sun" : "moon"}
    class="svg h-4 w-4 inline"
  />
  <p class="ml-2 text-sm inline">{isLightTheme ? "Light" : "Dark"} Mode</p>
</button>
