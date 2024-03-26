export interface TooltipInfo {
  readonly title?: string;
  readonly content?: readonly TooltipContent[];
  readonly footer?: TooltipFooter;
}

//#region Content

interface _TooltipContent {
  readonly type: "text" | "html" | "image";
}

export interface TooltipTextContent extends _TooltipContent {
  readonly type: "text";
  readonly text: string;
  readonly classes?: string[];
}

export interface TooltipHtmlContent extends _TooltipContent {
  readonly type: "html";
  readonly html: string;
}

export interface TooltipImageContent extends _TooltipContent {
  readonly type: "image";
  readonly source: string;
  readonly dimensions?: string;
}

export type TooltipContent =
  TooltipTextContent |
  TooltipHtmlContent |
  TooltipImageContent;

//#endregion

//#region Footers

interface _TooltipFooter {
  readonly type: "file" | "url";
}

export interface TooltipFileFooter extends _TooltipFooter {
  readonly type: "file";
  readonly fileId: number;
}

export interface TooltipUrlFooter extends _TooltipFooter {
  readonly type: "url";
  readonly href: string;
  readonly attribution?: string;
}

export type TooltipFooter =
  TooltipFileFooter |
  TooltipUrlFooter;

//#endregion
