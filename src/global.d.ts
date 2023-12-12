/// <reference types="svelte" />

import type * as hashing from "@s4tk/hashing";
import type * as formatting from "@s4tk/hashing/formatting";
import type * as models from "@s4tk/models";
import type * as enums from "@s4tk/models/enums";
import type * as validation from "@s4tk/validation";
import type * as xml from "@s4tk/xml-dom";

declare global {
  interface Window {
    NodeJS: {
      Buffer: typeof Buffer;
    };

    S4TK: {
      hashing: typeof hashing;
      formatting: typeof formatting;
      enums: typeof enums;
      models: typeof models;
      validation: typeof validation;
      xml: typeof xml;
    };
  }
}

window.NodeJS = window.NodeJS || {};
window.S4TK = window.S4TK || {};
