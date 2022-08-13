import type { TuningResourceType } from "@s4tk/models/enums";
import type { ResourceKey } from "@s4tk/models/types";

export interface GlobalSettings {
  filenamePrefix: string;
  all32bit: boolean;
  allHighBit: boolean;
}

export interface GeneratedFileData {
  id: number;
  filename: string;
  hasSimData: boolean;
  manualKey?: ResourceKey;
  type: TuningResourceType;
  use32bit: boolean;
  useHighBit: boolean;
}
