import { hoverTooltip } from "@codemirror/view";
import Settings from "lib/utils/settings";
import { renderTooltip } from "lib/viewer/tooltips/tooltip-renderer";
import { resolveTooltipForToken } from "lib/viewer/tooltips/tooltip-resolver";

export const resourceKeyHoverTooltip = hoverTooltip(async (view, pos, side) => {
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

  // try to create tooltip
  const tooltip = await resolveTooltipForToken(token);
  if (!tooltip) return null;
  return {
    pos: start,
    end: end,
    above: true,
    create: (_) => ({ dom: renderTooltip(tooltip) }),
  };
});
