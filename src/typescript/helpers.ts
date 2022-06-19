import type { SimDataResource, XmlResource } from "@s4tk/models";
import type { ResourceKeyPair } from "@s4tk/models/types";

const { BinaryResourceType, TuningResourceType, SimDataGroup, StringTableLocale, EncodingType } = window.S4TK.enums;
const { formatAsHexString } = window.S4TK.formatting;

export function getTypeDisplay(type: number, group?: number): string {
  if (type === BinaryResourceType.SimData) {
    return group in SimDataGroup
      ? `${useSpaces(SimDataGroup[group])} SimData`
      : "SimData";
  } else if (type in TuningResourceType) {
    return useSpaces(TuningResourceType[type]) + " Tuning";
  } else {
    return useSpaces(
      BinaryResourceType[type] ??
      "Type " + formatAsHexString(type, 8, true)
    );
  }
}

export function getDisplayName(entry: ResourceKeyPair): string {
  switch (entry.value.encodingType) {
    case EncodingType.XML:
      return (entry.value as XmlResource).root.name;
    case EncodingType.DATA:
      return (entry.value as SimDataResource).instance.name;
    case EncodingType.STBL:
      const locale =
        StringTableLocale[StringTableLocale.getLocale(entry.key.instance)];
      return locale + " String Table";
    default:
      return "Unknown";
  }
}

export function isEncodingSupported(type: number): boolean {
  return (
    type === BinaryResourceType.StringTable ||
    type === BinaryResourceType.SimData ||
    type in TuningResourceType
  );
}

function useSpaces(name: string): string {
  return name.replace(/([A-Z])/g, " $1");
}
