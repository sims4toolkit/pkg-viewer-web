import type { DiagnosticInfo } from "@s4tk/validation";

interface _TooltipInfo {
  readonly isFetched?: boolean;
}

export interface StringTooltipInfo extends _TooltipInfo {
  readonly stblId: number;
  readonly text: string;
}

export interface FileTooltipInfo extends _TooltipInfo {
  readonly id: number;
  readonly displayName: string;
  readonly resourceKey: string;
  readonly diagnostics: readonly DiagnosticInfo[];
}

export type TooltipInfo = StringTooltipInfo | FileTooltipInfo;
