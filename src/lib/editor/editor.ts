import { EditorView, keymap } from "@codemirror/view";
import { Compartment, EditorState } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { xml } from "@codemirror/lang-xml";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { darkEditor } from "./editor-theme-dark";
import { lightEditor } from "./editor-theme-light";
import { resourceKeyHoverTooltip } from "./tooltips";

type SupportedLanguage = "xml" | "json" | "py" | "js";

namespace CodemirrorEditor {
  const _themeCompartment = new Compartment();
  const _langCompartment = new Compartment();

  export function create(
    parent: HTMLElement,
    isDarkTheme: boolean,
    language: SupportedLanguage,
  ): EditorView {
    return new EditorView({
      parent: parent,
      state: EditorState.create({
        extensions: [
          basicSetup,
          keymap.of([indentWithTab]),
          _langCompartment.of(_getLanguageSupport(language)),
          _themeCompartment.of(isDarkTheme ? darkEditor : lightEditor),
          EditorState.readOnly.of(true),
          resourceKeyHoverTooltip,
        ]
      })
    });
  }

  export function updateContent(
    editor: EditorView,
    content: string,
    language: SupportedLanguage,
    scrollToTop = false
  ) {
    const effects = [_langCompartment.reconfigure(_getLanguageSupport(language))];
    if (scrollToTop) effects.push(EditorView.scrollIntoView(0));
    editor.update([editor.state.update({
      changes: {
        from: 0,
        to: editor.state.doc.length,
        insert: content
      },
      effects: effects
    })]);
  }

  export function updateTheme(editor: EditorView, isDarkTheme: boolean) {
    const theme = isDarkTheme ? darkEditor : lightEditor;
    editor.dispatch({
      effects: _themeCompartment.reconfigure(theme)
    });
  }

  function _getLanguageSupport(language: SupportedLanguage) {
    switch (language) {
      case "xml":
        return xml();
      case "json":
        return json();
      case "js":
        return javascript();
      case "py":
        return python();
    }
  }
}

export default CodemirrorEditor;
