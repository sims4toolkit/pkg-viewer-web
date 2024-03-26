import { addPascalSpaces } from "lib/utils/helpers";
import ViewerState from "../viewer-state";
import type { TooltipInfo } from "./tooltip-info";
import TooltipBuilder from "./tooltip-builder";
import ExternalTooltips from "./external-tooltips";
import Settings from "lib/utils/settings";
import { RenderType } from "../viewable-file-info";
const { TuningResourceType, BinaryResourceType } = window.S4TK.enums;

/**
 * Creates a tooltip for the given token, if possible. If no tooltip can be
 * resolved, `null` is returned.
 * 
 * @param token Token to create tooltip for
 */
export async function resolveTooltipForToken(token: string): Promise<TooltipInfo | null> {
  for (let i = 0; i < _TOOLTIP_RESOLVERS.length; ++i) {
    const resolver = _TOOLTIP_RESOLVERS[i];
    if (!resolver.tokenRegex.test(token)) continue;
    const internal = resolver.getTooltipInternal(token);
    if (internal) return internal;
    if (!Settings.showMissingRefTooltips) return null;
    return await resolver.getTooltipExternal(token);
  }

  return null;
}

//#region Resolvers

interface TooltipResolver {
  tokenRegex: RegExp;
  getTooltipInternal(token: string): TooltipInfo | null;
  getTooltipExternal(token: string): Promise<TooltipInfo | null>;
}

const _TOOLTIP_RESOLVERS: readonly TooltipResolver[] = [
  { // decimal instance
    tokenRegex: /^\d{4,}$/,
    getTooltipInternal(token) {
      const internal = ViewerState.mappings.getFileInfoByKey(token);
      if (!internal) return null;

      const type = parseInt(internal.resourceKey.split("-")[0], 16);
      const typeName = TuningResourceType[type] ?? "Unknown";
      const formattedTypeName = addPascalSpaces(typeName);

      return new TooltipBuilder()
        .setTitle(formattedTypeName)
        .addTextContent(internal.displayName, ["monospace"])
        .setFooterFile(internal.id)
        .build();
    },
    async getTooltipExternal(token) {
      const external = await ExternalTooltips.fetchTuningData(token);
      if (!external) return null;

      const typeName = TuningResourceType[external.type] ?? "Unknown";
      const formattedTypeName = addPascalSpaces(typeName);
      const packNote = external.group === "00000000" ?
        "From Base Game" :
        `From Pack (Group: ${external.group})`;

      return new TooltipBuilder()
        .setTitle(formattedTypeName)
        .addTextContent(external.name, ["monospace"])
        .addTextContent(packNote, ["text-xs", "text-subtle"])
        .setFooterUrl(`#/fetch/tuning/${token}`, external.endpoint)
        .build();
    }
  },
  { // string key
    tokenRegex: /^0x[\da-fA-F]{1,8}$/,
    getTooltipInternal(token) {
      const internal = ViewerState.mappings.getStringInfo(token);
      if (!internal) return null;

      return new TooltipBuilder()
        .setTitle("String")
        .addTextContent(`"${internal.text}"`)
        .setFooterFile(internal.stblId)
        .build();
    },
    async getTooltipExternal(token) {
      const external = await ExternalTooltips.fetchStringData(token);
      if (!external) return null;

      const packNote = external.pack === "BASE_GAME" ?
        "From Base Game" :
        `From Pack (${external.pack})`;

      return new TooltipBuilder()
        .setTitle("String")
        .addTextContent(`"${external.text}"`)
        .addTextContent(packNote, ["text-xs", "text-subtle"])
        .setFooterUrl("https://tdesc.lot51.cc/tools/strings", external.endpoint)
        .build();
    },
  },
  { // hex resource key
    tokenRegex: /^[\da-fA-F]{8}[:-][\da-fA-F]{8}[:-][\da-fA-F]{16}$/,
    getTooltipInternal(token) {
      token = token.toUpperCase().replace(/:/g, "-").replace(/^2F7D0004/, "00B2D882");
      const internal = ViewerState.mappings.getFileInfoByKey(token);
      if (!internal) return null;

      const type = parseInt(internal.resourceKey.split("-")[0], 16);
      const typeName = BinaryResourceType[type] ?? "Unknown";
      const formattedTypeName = addPascalSpaces(typeName);

      const builder = new TooltipBuilder()
        .setTitle(formattedTypeName)
        .setFooterFile(internal.id);

      if (internal.renderType === RenderType.Image) {
        builder.addImageContent(internal.pngBase64, {
          width: internal.width?.toString(),
          height: internal.height?.toString(),
        });
      } else {
        builder.addTextContent(internal.displayName);
      }

      return builder.build();
    },
    async getTooltipExternal(token) {
      // if not an image, external is null
      const external = await ExternalTooltips.fetchImageData(token);
      if (!external) return null;

      const type = parseInt(token.split(/[:-]/)[0], 16);
      const typeName = BinaryResourceType[type] ?? "Unknown";
      const formattedTypeName = addPascalSpaces(typeName);

      return new TooltipBuilder()
        .setTitle(formattedTypeName)
        .addImageContent(external.source)
        .setFooterUrl(external.source, external.endpoint)
        .build();
    },
  }
];

//#endregion
