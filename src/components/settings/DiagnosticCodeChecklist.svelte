<script lang="ts">
  import type { DiagnosticCode } from "@s4tk/validation";
  import Settings from "lib/utils/settings";
  const { DiagnosticCode: Code } = window.S4TK.validation;

  export let title: string;
  export let codePrefix: "GEN" | "TUN" | "STB" | "DAT" | "TDS";

  const codes = Code.getAll(codePrefix);

  function initiallyChecked(code: DiagnosticCode): boolean {
    return !Settings.suppressedDiagnosticCodes.has(code);
  }
</script>

<div>
  <p class="uppercase font-bold text-sm">{title}</p>
  <ul>
    {#each codes as code}
      <li>
        <input
          id="setting-code-{code}"
          name={code}
          type="checkbox"
          checked={initiallyChecked(code)}
        />
        <label for="setting-code-{code}" class="text-sm"
          ><span class="monospace text-subtle">{code}</span>: {Code.getBrief(
            code
          )}</label
        >
      </li>
    {/each}
  </ul>
</div>
