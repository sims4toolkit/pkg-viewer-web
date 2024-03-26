import type { EditorView } from "codemirror";
import { hoverTooltip, TooltipView } from "@codemirror/view";
import ViewerState from "lib/viewer/viewer-state";
import { addPascalSpaces } from "lib/utils/helpers";
const { TuningResourceType, BinaryResourceType } = window.S4TK.enums;

export const resourceKeyHoverTooltip = hoverTooltip((view, pos, side) => {
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
    const { regex, domGenerator } = _POSSIBLE_TOOLTIPS[i];
    if (regex.test(token)) return {
      pos: start,
      end: end,
      above: true,
      create: domGenerator(token),
    };
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

const _POSSIBLE_TOOLTIPS: {
  regex: RegExp;
  domGenerator(token: string): (view: EditorView) => TooltipView;
}[] = [
    {
      // decimal instance
      regex: /^\d+$/,
      domGenerator(token) {
        return (_) => {
          const dom = document.createElement("div");
          dom.classList.add("p-1", "text-sm", "flex", "flex-col", "items-start", "gap-1");
          const tooltip = ViewerState.mappings.getFileTooltip(token);

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
    {
      // hex resource key (tuning or simdata)
      regex: /^[\da-fA-F]{8}[:-][\da-fA-F]{8}[:-][\da-fA-F]{16}$/,
      domGenerator(token) {
        return (_) => {
          token = token.replace(/:/g, "-");

          const dom = document.createElement("div");
          dom.classList.add("p-1", "text-sm", "flex", "flex-col", "items-start", "gap-1");
          let tooltip = ViewerState.mappings.getFileTooltip(token);
          if (!tooltip) {
            tooltip = ViewerState.mappings.getFileTooltip(token.replace(/^2f7d0004/i, "00B2D882"));
          }

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
    {
      // string key
      regex: /^0x[\da-fA-F]{1,8}$/,
      domGenerator(token) {
        return (_) => {
          const dom = document.createElement("div");
          dom.classList.add("p-1", "text-sm", "flex", "flex-col", "items-start", "gap-1");
          const tooltip = ViewerState.mappings.getStringTooltip(token);

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
