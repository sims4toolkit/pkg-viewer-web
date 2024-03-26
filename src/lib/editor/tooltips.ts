import { hoverTooltip, TooltipView } from "@codemirror/view";
import ViewerState from "lib/viewer/viewer-state";
import { addPascalSpaces } from "lib/utils/helpers";
import Settings from "lib/utils/settings";
import type { FileTooltipInfo, StringTooltipInfo, TooltipInfo } from "lib/viewer/tooltips";
const { TuningResourceType, BinaryResourceType } = window.S4TK.enums;

//#region Tooltips

export const resourceKeyHoverTooltip = hoverTooltip((view, pos, side) => {
  if (!Settings.showRefTooltips) return null;

  // find whole token at hover position
  const hoverableRegex = /[\da-zA-Z:-]/;
  const { from, to, text } = view.state.doc.lineAt(pos);
  let start = pos, end = pos;
  while (start > from && hoverableRegex.test(text[start - from - 1])) start--;
  while (end < to && hoverableRegex.test(text[end - from])) end++;
  if (start == pos && side < 0 || end == pos && side > 0) return null;

  // ensure token is within a tag and not an attribute
  if (text.charAt(start - from - 1) !== ">" || text.charAt(end - from) !== "<") return null;
  const token = text.slice(start - from, end - from);

  // test and apply possible tooltips
  for (let i = 0; i < _POSSIBLE_TOOLTIPS.length; ++i) {
    const { tokenRegex, getTooltip, generateView } = _POSSIBLE_TOOLTIPS[i];
    if (!tokenRegex.test(token)) continue;
    const tooltip = getTooltip(token);
    if (!tooltip && !Settings.showMissingRefTooltips) continue;
    return { pos: start, end: end, above: true, create: generateView(tooltip as any) };
  }

  return null;
});

//#endregion

//#region Tooltip Generators

interface _TooltipGenerator<T extends TooltipInfo> {
  tokenRegex: RegExp;
  getTooltip(token: string): T;
  generateView(tooltip: T): () => TooltipView;
}

type FileTooltipGenerator = _TooltipGenerator<FileTooltipInfo>;
type StringTooltipGenerator = _TooltipGenerator<StringTooltipInfo>;
type TooltipGenerator = FileTooltipGenerator | StringTooltipGenerator;

const _POSSIBLE_TOOLTIPS: TooltipGenerator[] = [
  { // decimal instance
    tokenRegex: /^\d{4,}$/,
    getTooltip(token): FileTooltipInfo {
      return ViewerState.mappings.getFileTooltip(token);
    },
    generateView: (tooltip: FileTooltipInfo) => _tooltipViewWrapper(tooltip, "Tuning", dom => {
      const type = parseInt(tooltip.resourceKey.split("-")[0], 16);
      const typeName = TuningResourceType[type] ?? "Unknown";
      const formattedTypeName = `${addPascalSpaces(typeName)} Tuning`;
      _addTextToDom(dom, formattedTypeName, { title: true });
      _addTextToDom(dom, tooltip.displayName, { classes: ["monospace"] });
      _addFileLinkToDom(dom, tooltip.id);
    }),
  },
  { // hex resource key (tuning or simdata)
    tokenRegex: /^[\da-fA-F]{8}[:-][\da-fA-F]{8}[:-][\da-fA-F]{16}$/,
    getTooltip(token): FileTooltipInfo {
      token = token.replace(/:/g, "-");
      let tooltip = ViewerState.mappings.getFileTooltip(token);
      if (!tooltip && token.toLowerCase().startsWith("2f7d0004")) {
        token = token.replace(/^2f7d0004/i, "00B2D882");
        tooltip = ViewerState.mappings.getFileTooltip(token);
      }
      return tooltip;
    },
    generateView: (tooltip: FileTooltipInfo) => _tooltipViewWrapper(tooltip, "File", dom => {
      const type = parseInt(tooltip.resourceKey.split("-")[0], 16);
      const typeName = BinaryResourceType[type] ?? "Unknown";
      const formattedTypeName = addPascalSpaces(typeName);
      if (tooltip.displayName.toLowerCase() !== formattedTypeName.toLowerCase())
        _addTextToDom(dom, formattedTypeName, { title: true });
      _addTextToDom(dom, tooltip.displayName);
      _addFileLinkToDom(dom, tooltip.id);
    }),
  },
  { // string key
    tokenRegex: /^0x[\da-fA-F]{1,8}$/,
    getTooltip(token): StringTooltipInfo {
      return ViewerState.mappings.getStringTooltip(token);
    },
    generateView: (tooltip: StringTooltipInfo) => _tooltipViewWrapper(tooltip, "String", dom => {
      _addTextToDom(dom, "String", { title: true });
      _addTextToDom(dom, `"${tooltip.text}"`);
      _addFileLinkToDom(dom, tooltip.stblId);
    }),
  },
];

//#endregion

//#region Tooltip Creation Helpers

function _tooltipViewWrapper<T extends TooltipInfo>(
  tooltip: T,
  tooltipType: string,
  buildDom: (dom: HTMLDivElement) => void
): () => TooltipView {
  return () => {
    const dom = document.createElement("div");
    dom.classList.add("p-1", "text-sm", "flex", "flex-col", "items-start", "gap-1");
    if (tooltip) {
      buildDom(dom);
    } else {
      dom.innerHTML = `<em>${tooltipType} not found.</em>`;
    }
    return { dom };
  };
}

function _addTextToDom(
  dom: HTMLDivElement,
  text: string,
  options?: {
    title?: boolean;
    classes?: string[];
  }
) {
  const p = document.createElement("p");
  if (options?.title) p.classList.add("uppercase", "text-xs", "font-bold", "text-subtle");
  if (options?.classes?.length) p.classList.add(...options.classes);
  p.textContent = text;
  dom.appendChild(p);
}

function _addFileLinkToDom(dom: HTMLDivElement, fileId: number) {
  const hr = document.createElement("hr");
  hr.classList.add("opacity-20", "w-full");
  dom.appendChild(hr);

  const button = document.createElement("button");
  button.classList.add("text-secondary");
  button.textContent = "Go to File";
  button.onclick = () => ViewerState.requestFile(fileId, true);
  dom.appendChild(button);
}

//#endregion
