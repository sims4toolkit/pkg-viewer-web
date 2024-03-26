import type { DiagnosticInfo } from "@s4tk/validation";

export interface StringTooltipInfo {
  readonly stblId: number;
  readonly text: string;
}

export interface FileTooltipInfo {
  readonly id: number;
  readonly displayName: string;
  readonly resourceKey: string;
  readonly diagnostics: readonly DiagnosticInfo[];
}
