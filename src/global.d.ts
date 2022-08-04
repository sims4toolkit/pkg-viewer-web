/// <reference types="svelte" />

import type { fnv32, fnv64 } from "@s4tk/hashing";
import type { formatAsHexString, formatResourceKey, formatStringKey, formatResourceInstance } from "@s4tk/hashing/formatting";
import type { Package, StringTableResource, XmlResource, SimDataResource, RawResource } from "@s4tk/models";
import type { StringTableLocale, BinaryResourceType, TuningResourceType, SimDataGroup, EncodingType } from "@s4tk/models/enums";

interface UserSettings {
  isLightTheme: boolean;
}

interface EntryFilterSettings {
  showUnsupported: boolean;
  showNonEnStbls: boolean;
  fileType: number;
  simDataGroup: number;
  stblLocale: number;
  filename: string;
  instanceHex: string;
}

interface EntryViewSettings {
  resourceKeyFormat: number;
  formattedXml: boolean;
  sortOrder: number;
}

declare global {
  interface Window {
    Prism: any,
    S4TK: {
      enums: {
        StringTableLocale: typeof StringTableLocale;
        BinaryResourceType: typeof BinaryResourceType;
        TuningResourceType: typeof TuningResourceType;
        SimDataGroup: typeof SimDataGroup;
        EncodingType: typeof EncodingType;
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
window.Prism = window.Prism || {};
