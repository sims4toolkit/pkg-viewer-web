<script lang="ts">
  import type { DiagnosticCode, DiagnosticLevel } from "@s4tk/validation";
  import Settings from "lib/utils/settings";
  import Switch from "components/elements/Switch.svelte";
  import DiagnosticCodeChecklist from "./DiagnosticCodeChecklist.svelte";
  import DiagnosticLevelCheckbox from "./DiagnosticLevelCheckbox.svelte";
  const { DiagnosticCode: Code, DiagnosticLevel: Level } =
    window.S4TK.validation;

  export const save = () => {
    Settings.formatXmlSpaces = Math.min(8, Math.max(1, xmlSpaces));
    Settings.showDiagnosticCodesOnUi = showDiagnosticCodesOnUi;
    Settings.expandFoldersByDefault = expandFoldersByDefault;
    saveLevels();
    saveCodes();
  };

  let xmlSpaces = Settings.formatXmlSpaces;
  let showDiagnosticCodesOnUi = Settings.showDiagnosticCodesOnUi;
  let expandFoldersByDefault = Settings.expandFoldersByDefault;

  function saveLevels() {
    try {
      const suppressed = new Set<DiagnosticLevel>();
      ["Error", "Warning", "Info"].forEach((name) => {
        const input = document.getElementsByName(name)[0] as HTMLInputElement;
        if (!input.checked) suppressed.add(Level[name]);
      });
      Settings.suppressedDiagnosticLevels = suppressed;
    } catch (e) {
      console.error(e);
    }
  }

  function saveCodes() {
    try {
      const suppressed = new Set<DiagnosticCode>();
      Code.getAll().forEach((code) => {
        if (code === "Unknown") return;
        const input = document.getElementsByName(code)[0] as HTMLInputElement;
        if (!input.checked) suppressed.add(code);
      });
      Settings.suppressedDiagnosticCodes = suppressed;
    } catch (e) {
      console.error(e);
    }
  }
</script>

<div class="w-full h-full overflow-y-auto flex flex-col gap-6">
  <div class="w-full flex flex-col gap-2">
    <Switch
      label="Show diagnostic codes in bottom panel"
      bind:checked={showDiagnosticCodesOnUi}
    />
    <Switch
      label="Expand file explorer folders by default"
      bind:checked={expandFoldersByDefault}
    />
    <div class="w-full flex justify-between">
      <label class="text-sm" for="setting-xml-spaces"
        >Spaces in formatted XML</label
      >
      <input
        bind:value={xmlSpaces}
        id="setting-xml-spaces"
        class="px-2 w-16 bg-transparent rounded border border-solid border-gray-600 dark:border-white"
        type="number"
        min="1"
        max="8"
      />
    </div>
  </div>
  <div class="text-left w-full">
    <h2 class="mb-2 font-bold">Enabled Diagnostic Levels</h2>
    <div class="flex flex-wrap gap-4">
      <DiagnosticLevelCheckbox level={Level.Error} />
      <DiagnosticLevelCheckbox level={Level.Warning} />
      <DiagnosticLevelCheckbox level={Level.Info} />
    </div>
  </div>
  <div class="text-left w-full">
    <h2 class="mb-2 font-bold">Enabled Diagnostics</h2>
    <div
      class="w-full flex flex-col gap-4 bg-gray-50 dark:bg-gray-900 p-2 rounded"
    >
      <DiagnosticCodeChecklist title="General" codePrefix="GEN" />
      <DiagnosticCodeChecklist title="Tuning" codePrefix="TUN" />
      <!-- TODO: add back when TDESC validation added -->
      <!-- <DiagnosticCodeChecklist title="TDESC" codePrefix="TDS" /> -->
      <DiagnosticCodeChecklist title="SimData" codePrefix="DAT" />
      <DiagnosticCodeChecklist title="String Table" codePrefix="STB" />
    </div>
  </div>
</div>
