// TODO: rename file `index-data.ts`

import type { StringTableLocale } from "@s4tk/models/enums";
import type { DiagnosticInfo } from "@s4tk/validation";

//#region Render Types

export enum RenderType {
  Unknown,
  Corrupt,
  StringTable,
  Image,
  Deleted,
  PlainText
}

type UnrenderableRenderType =
  RenderType.Unknown |
  RenderType.Corrupt |
  RenderType.Deleted;

//#endregion

//#region File Info

interface _ViewableFileInfoBase {
  readonly renderType: RenderType;
  readonly id: number;
  readonly displayName: string;
  readonly resourceKey: string;
  readonly diagnostics: readonly DiagnosticInfo[];
  readonly extension: string;
  readonly downloadData: Buffer;
}

export interface UnrenderableFileInfo extends _ViewableFileInfoBase {
  readonly renderType: UnrenderableRenderType;
}

export interface PlainTextFileInfo extends _ViewableFileInfoBase {
  readonly renderType: RenderType.PlainText;
  readonly textContent: string;
  readonly language: "xml" | "json";
  readonly tdescMetadata?: {
    readonly class: string;
    readonly type: string;
    readonly module: string;
  };
}

export interface StringTableFileInfo extends _ViewableFileInfoBase {
  readonly renderType: RenderType.StringTable;
  readonly locale: StringTableLocale;
  readonly entries: { key: number; value: string; }[];
}

export interface ImageFileInfo extends _ViewableFileInfoBase {
  readonly renderType: RenderType.Image;
  readonly pngBase64: string;
  readonly width?: number;
  readonly height?: number;
}

export type ViewableFileInfo =
  UnrenderableFileInfo |
  PlainTextFileInfo |
  StringTableFileInfo |
  ImageFileInfo;

//#endregion

//#region String Info

export interface StringEntryInfo {
  readonly stblId: number;
  readonly text: string;
}

//#endregion
