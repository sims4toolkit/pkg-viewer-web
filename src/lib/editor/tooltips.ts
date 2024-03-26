import { hoverTooltip, TooltipView } from "@codemirror/view";
import ViewerState from "lib/viewer/viewer-state";
import { addPascalSpaces } from "lib/utils/helpers";
import Settings from "lib/utils/settings";
import type { FileTooltipInfo, StringTooltipInfo } from "lib/viewer/tooltips";
const { TuningResourceType, BinaryResourceType } = window.S4TK.enums;

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

function _addFileLinkButton(dom: HTMLDivElement, fileId: number) {
  const hr = document.createElement("hr");
  hr.classList.add("opacity-20", "w-full")
  dom.appendChild(hr);
  const button = document.createElement("button");
  button.classList.add("text-secondary");
  dom.appendChild(button);
  button.textContent = "Go to File";
  button.onclick = function () {
    ViewerState.requestFile(fileId, true);
  }
}

interface _TooltipGenerator<TooltipType> {
  tokenRegex: RegExp;
  getTooltip(token: string): TooltipType;
  generateView(tooltip: TooltipType): () => TooltipView;
}

type FileTooltipGenerator = _TooltipGenerator<FileTooltipInfo>;
type StringTooltipGenerator = _TooltipGenerator<StringTooltipInfo>;
type TooltipGenerator = FileTooltipGenerator | StringTooltipGenerator;

const _POSSIBLE_TOOLTIPS: TooltipGenerator[] = [
  { // decimal instance
    tokenRegex: /^\d+$/,
    getTooltip(token): FileTooltipInfo {
      return ViewerState.mappings.getFileTooltip(token);
    },
    generateView(tooltip: FileTooltipInfo) {
      return () => {
        const dom = document.createElement("div");
        dom.classList.add("p-1", "text-sm", "flex", "flex-col", "items-start", "gap-1");

        if (tooltip) {
          const type = parseInt(tooltip.resourceKey.split("-")[0], 16);
          const typeName = TuningResourceType[type] ?? "Unknown";

          const title = document.createElement("p");
          title.classList.add("uppercase", "text-xs", "font-bold", "text-subtle");
          title.textContent = `${addPascalSpaces(typeName)} Tuning`;
          dom.appendChild(title);

          const body = document.createElement("p");
          body.classList.add("monospace");
          body.textContent = tooltip.displayName;
          dom.append(body);

          _addFileLinkButton(dom, tooltip.id);
        } else {
          dom.innerHTML = `<em>Tuning not found in package.</em>`;
        }

        return { dom };
      };
    }
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
    generateView(tooltip: FileTooltipInfo) {
      return () => {
        const dom = document.createElement("div");
        dom.classList.add("p-1", "text-sm", "flex", "flex-col", "items-start", "gap-1");

        if (tooltip) {
          const type = parseInt(tooltip.resourceKey.split("-")[0], 16);
          const typeName = BinaryResourceType[type] ?? "Unknown";

          const title = document.createElement("p");
          title.classList.add("uppercase", "text-xs", "font-bold", "text-subtle");
          title.textContent = addPascalSpaces(typeName);

          const body = document.createElement("p");
          body.classList.add("monospace");
          body.textContent = tooltip.displayName;

          if (body.textContent.toLowerCase() !== title.textContent.toLowerCase())
            dom.appendChild(title);
          dom.append(body);

          _addFileLinkButton(dom, tooltip.id);
        } else {
          dom.innerHTML = `<em>File not found in package.</em>`;
        }

        return { dom };
      };
    }
  },
  { // string key
    tokenRegex: /^0x[\da-fA-F]{1,8}$/,
    getTooltip(token): StringTooltipInfo {
      return ViewerState.mappings.getStringTooltip(token);
    },
    generateView(tooltip: StringTooltipInfo) {
      return () => {
        const dom = document.createElement("div");
        dom.classList.add("p-1", "text-sm", "flex", "flex-col", "items-start", "gap-1");

        if (tooltip) {
          const title = document.createElement("p");
          title.classList.add("uppercase", "text-xs", "font-bold", "text-subtle");
          title.textContent = "String";
          dom.appendChild(title);

          const body = document.createElement("p");
          body.textContent = `"${tooltip.text}"`;
          dom.append(body);

          _addFileLinkButton(dom, tooltip.stblId);
        } else {
          dom.innerHTML = `<em>String not found in package.</em>`;
        }

        return { dom };
      };
    }
  },
];
