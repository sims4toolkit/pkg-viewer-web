<script lang="ts">
  const prism = window.Prism;

  export let language = "none";
  export let source = "";

  let formattedCode: string;
  $: source && highlightCode();
  $: languageCode = getLanguageCode();

  function highlightCode() {
    const grammar = prism.languages[languageCode];
    formattedCode =
      languageCode === "none"
        ? source
        : prism.highlight(source, grammar, languageCode);
  }

  function getLanguageCode() {
    switch (language) {
      case "xml":
      case "py":
      case "json":
      case "html":
      case "js":
      case "ts":
        return language;
      case "cjs":
        return "js";
      default:
        return "none";
    }
  }
</script>

<pre class="language-{languageCode}" command-line data-output="2-17"><code
    class="language-{languageCode}"
    >{#if languageCode === "none"}{formattedCode}{:else}{@html formattedCode}{/if}</code
  ></pre>
