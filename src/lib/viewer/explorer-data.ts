import type { DiagnosticInfo } from "@s4tk/validation";
import type { PlainTextFileInfo, StringTableFileInfo, ViewableFileInfo } from "./viewable-file-info";
import Diagnostics from "./diagnostics";

export enum DisplayType {
  Unspecified,
  Tuning,
  StringTable
}

interface _ExplorerCellBase {
  readonly displayType: DisplayType;
  readonly filterName: string;
  readonly containedIds: ReadonlySet<number>;
  readonly defaultId: number;
}

export interface UnspecifiedExplorerCell extends _ExplorerCellBase {
  readonly displayType: DisplayType.Unspecified;
  readonly info: ViewableFileInfo;
}

export interface TuningExplorerCell extends _ExplorerCellBase {
  readonly displayType: DisplayType.Tuning;
  readonly tuningInfo: PlainTextFileInfo;
  readonly simDataInfo?: PlainTextFileInfo;
}

export interface StringTableExplorerCell extends _ExplorerCellBase {
  readonly displayType: DisplayType.StringTable;
  readonly sharedResourceKey: string;
  readonly localeChoices: readonly StringTableFileInfo[];
  chosenLocaleIndex: number;
}

export type ExplorerCell =
  UnspecifiedExplorerCell |
  TuningExplorerCell |
  StringTableExplorerCell;

export interface ExplorerSection<T extends ExplorerCell = ExplorerCell> {
  readonly title: string;
  readonly cells: readonly T[];
  collapsed: boolean;
}

export namespace ExplorerCell {
  export function isActive(cell: ExplorerCell, activeId: number): boolean {
    return cell.containedIds.has(activeId);
  }

  export function passesSearch(cell: ExplorerCell, term: string): boolean {
    term = term?.trim();
    if (!term) return true;
    return cell.filterName.toLowerCase().includes(term.toLowerCase());
  }

  export function allDiagnostics(cell: ExplorerCell): DiagnosticInfo[] {
    let baseDiagnostics: DiagnosticInfo[];

    switch (cell.displayType) {
      case DisplayType.StringTable: {
        baseDiagnostics = [];
        cell.localeChoices.forEach(info => {
          baseDiagnostics.push(...info.diagnostics);
        });
        break;
      }
      case DisplayType.Tuning: {
        baseDiagnostics = [
          ...cell.tuningInfo.diagnostics,
          ...(cell.simDataInfo?.diagnostics ?? []),
        ];
        break;
      }
      case DisplayType.Unspecified: {
        baseDiagnostics = cell.info.diagnostics as DiagnosticInfo[];
        break;
      }
    }

    return baseDiagnostics
      .filter(d => Diagnostics.passesSettings(d))
      .sort(Diagnostics.sorter);
  }
}
