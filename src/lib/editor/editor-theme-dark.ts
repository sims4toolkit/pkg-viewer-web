import { EditorView } from "@codemirror/view";
import type { Extension } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// Using https://github.com/one-dark/vscode-one-dark-theme/ as reference for the colors

const chalky = "#e5c07b",
  coral = "#e06c75",
  cyan = "#56b6c2",
  invalid = "#ffffff",
  ivory = "#d3d8e0",
  stone = "#7d8799", // Brightened compared to original to increase contrast
  malibu = "#61afef",
  sage = "#98c379",
  whiskey = "#d19a66",
  violet = "#c678dd",
  darkBackground = "#21252b",
  highlightBackground = "#2c313a",
  background = "#282c34",
  tooltipBackground = "#353a42",
  selection = "#3E4451",
  cursor = "#528bff";

/// The editor theme styles for One Dark.
export const darkTheme = EditorView.theme({
  "&": {
    color: ivory,
    // backgroundColor: background
  },

  ".cm-content": {
    caretColor: cursor
  },

  ".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor },
  "&.cm-focused .cm-selectionBackground, .cm-content ::selection": { backgroundColor: selection },
  ".cm-selectionBackground": { backgroundColor: `${selection} !important` },

  ".cm-panels": { backgroundColor: darkBackground, color: ivory },
  ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
  ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

  ".cm-searchMatch": {
    backgroundColor: "#72a1ff59",
    outline: "1px solid #457dff"
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#6199ff2f"
  },

  ".cm-activeLine": { backgroundColor: "#6699ff0b" },
  ".cm-selectionMatch": { backgroundColor: "#aafe661a" },

  "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
    backgroundColor: "#bad0f847",
    outline: "1px solid #515a6b"
  },

  ".cm-gutters": {
    backgroundColor: background,
    color: stone,
    border: "none"
  },

  ".cm-activeLineGutter": {
    backgroundColor: highlightBackground
  },

  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "#ddd"
  },

  ".cm-tooltip": {
    border: "none",
    backgroundColor: tooltipBackground
  },
  ".cm-tooltip .cm-tooltip-arrow:before": {
    borderTopColor: "transparent",
    borderBottomColor: "transparent"
  },
  ".cm-tooltip .cm-tooltip-arrow:after": {
    borderTopColor: tooltipBackground,
    borderBottomColor: tooltipBackground
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: highlightBackground,
      color: ivory
    }
  }
}, { dark: true });

/// The highlighting style for code in the One Dark theme.
export const darkHighlightStyle = HighlightStyle.define([
  {
    tag: [t.tagName],
    color: coral
  },
  {
    tag: [t.propertyName],
    color: whiskey
  },
  {
    tag: [t.separator, t.character, t.name, t.operator, t.operatorKeyword],
    color: ivory
  },
  {
    tag: [t.url, t.link],
    color: cyan
  },
  {
    tag: [t.meta, t.comment, t.processingInstruction],
    color: stone
  },
  {
    tag: [t.string],
    color: sage
  },
  {
    tag: t.invalid,
    color: invalid
  },
  // non-XML related
  {
    tag: t.keyword,
    color: violet
  },
  {
    tag: [t.url, t.escape, t.regexp, t.link, t.special(t.string)],
    color: cyan
  },
  {
    tag: [t.function(t.variableName), t.labelName],
    color: malibu
  },
  {
    tag: [t.color, t.constant(t.name), t.standard(t.name)],
    color: whiskey
  },
  {
    tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
    color: chalky
  },
  {
    tag: [t.atom, t.bool, t.special(t.variableName)],
    color: whiskey
  },
]);

/// Extension to enable the One Dark theme (both the editor theme and the highlight style).
export const darkEditor: Extension = [darkTheme, syntaxHighlighting(darkHighlightStyle)];