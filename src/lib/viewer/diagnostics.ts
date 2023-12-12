import type { DiagnosticInfo, DiagnosticLevel } from "@s4tk/validation";
import Settings from "lib/utils/settings";

namespace Diagnostics {
  export function countExact(
    level: DiagnosticLevel,
    infos: readonly DiagnosticInfo[]
  ): number {
    return infos.filter(info => info.level === level).length;
  }

  export function countAtLeast(
    level: DiagnosticLevel,
    infos: readonly DiagnosticInfo[]
  ): number {
    return infos.filter(info => info.level >= level).length;
  }

  export function passesSettings(info: DiagnosticInfo): boolean {
    if (Settings.suppressedDiagnosticLevels.has(info.level)) return false;
    if (Settings.suppressedDiagnosticCodes.has(info.code)) return false;
    return true;
  }

  export function sorter(a: DiagnosticInfo, b: DiagnosticInfo): number {
    const diff = b.level - a.level;
    if (diff !== 0) return diff;
    if (a.code > b.code) return 1;
    if (a.code < b.code) return -1;
    return 0;
  }
}

export default Diagnostics;