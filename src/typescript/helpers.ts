const { BinaryResourceType, TuningResourceType, SimDataGroup } = window.S4TK.enums;
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
