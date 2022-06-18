const { BinaryResourceType, TuningResourceType, SimDataGroup } = window.S4TK.enums;
const { formatAsHexString } = window.S4TK.formatting;

export function getTypeDisplay(type: number, group?: number): string {
  if (type === BinaryResourceType.SimData) {
    return group in SimDataGroup
      ? `${SimDataGroup[group].replace(/([A-Z])/g, " $1")} SimData`
      : "SimData";
  } else {
    return (
      BinaryResourceType[type] ??
      TuningResourceType[type] ??
      "Type " + formatAsHexString(type, 8, true)
    ).replace(/([A-Z])/g, " $1");
  }
}