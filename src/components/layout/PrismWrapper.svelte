<script lang="ts">
  const prism = window.Prism;

  export let language = "none";
  export let source = "";

  let formattedCode: string;
  $: source && highlightCode();

  function highlightCode() {
    const grammar = prism.languages[language];
    formattedCode =
      language === "none" ? source : prism.highlight(source, grammar, language);
  }
</script>

<pre class="language-{language}" command-line data-output="2-17"><code
    class="language-{language}"
    >{#if language === "none"}{formattedCode}{:else}{@html formattedCode}{/if}</code
  ></pre>
