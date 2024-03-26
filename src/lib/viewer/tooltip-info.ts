interface _TooltipInfo {
  readonly sourceUrl?: string;
}

export interface StringTooltipInfo extends _TooltipInfo {
  readonly stblId: number;
  readonly text: string;
}

export interface FileTooltipInfo extends _TooltipInfo {
  readonly id: number;
  readonly displayName: string;
  readonly resourceKey: string;
}

export type TooltipInfo = StringTooltipInfo | FileTooltipInfo;
