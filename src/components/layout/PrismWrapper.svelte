<script lang="ts">
  import Select from "../shared/Select.svelte";

  const prism = window.Prism;

  export let language = "none";
  export let source = "";
  export let wrap = false;
  export let grammarSelect = false;

  let formattedCode: string;
  $: source && highlightCode();

  let chosenLanguage = 0;
  const languageChoices: {
    value: number;
    text: string;
    grammar: string;
  }[] = [
    {
      value: 0,
      text: "None",
      grammar: "none",
    },
    {
      value: 1,
      text: "JavaScript",
      grammar: "js",
    },
    {
      value: 2,
      text: "JSON",
      grammar: "js", // intentional
    },
    {
      value: 3,
      text: "Python",
      grammar: "py",
    },
    {
      value: 4,
      text: "TypeScript",
      grammar: "ts",
    },
    {
      value: 5,
      text: "XML",
      grammar: "xml",
    },
  ];

  $: {
    if (grammarSelect) {
      const previousLanguage = language;

      language =
        languageChoices.find((o) => o.value === chosenLanguage)?.grammar ??
        "none";

      if (previousLanguage !== language) highlightCode();
    }
  }

  function highlightCode() {
    const grammar = prism.languages[language];
    formattedCode =
      language === "none" ? source : prism.highlight(source, grammar, language);
  }
</script>

<pre
  class="language-{language}"
  command-line
  data-output="2-17"
  class:wrap><code class="language-{language}"
    >{#if language === "none"}{formattedCode}{:else}{@html formattedCode}{/if}</code
  ></pre>

{#if grammarSelect}
  <div class="grammar-select">
    <Select
      label="syntax"
      name="grammar-select"
      bind:selected={chosenLanguage}
      options={languageChoices}
    />
  </div>
{/if}

<style lang="scss">
  .grammar-select {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1024;
  }
</style>
