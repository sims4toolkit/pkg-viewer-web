/// <reference types="svelte" />

import type { fnv32, fnv64 } from "@s4tk/hashing";
import type { formatAsHexString, formatResourceKey, formatStringKey, formatResourceInstance } from "@s4tk/hashing/formatting";
import type { Package, StringTableResource, XmlResource, SimDataResource, RawResource } from "@s4tk/models";
import type { StringTableLocale, BinaryResourceType } from "@s4tk/models/enums";

interface UserSettings {
  isLightTheme: boolean;
}

declare global {
  interface Window {
    S4TK: {
      enums: {
        StringTableLocale: typeof StringTableLocale;
        BinaryResourceType: typeof BinaryResourceType;
      },
      formatting: {
        formatAsHexString: typeof formatAsHexString;
        formatResourceKey: typeof formatResourceKey;
        formatStringKey: typeof formatStringKey;
        formatResourceInstance: typeof formatResourceInstance;
      },
      hashing: {
        fnv32: typeof fnv32;
        fnv64: typeof fnv64;
      },
      models: {
        Package: typeof Package;
        StringTableResource: typeof StringTableResource;
        XmlResource: typeof XmlResource;
        SimDataResource: typeof SimDataResource;
        RawResource: typeof RawResource;
      },
      Node: {
        Buffer: typeof Buffer;
      }
    };
  }
}

window.S4TK = window.S4TK || {};
