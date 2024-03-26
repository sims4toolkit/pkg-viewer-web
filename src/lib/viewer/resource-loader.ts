import type * as modelsTypes from "@s4tk/models";
import type { ValidatedResource, ValidatedTuning, ValidatedSimData, ValidatedStringTable, DiagnosticInfo } from "@s4tk/validation";
import type { PlainTextFileInfo, StringTableFileInfo, ViewableFileInfo } from "./viewable-file-info";
import { RenderType } from "./viewable-file-info";
import { DisplayType, type ExplorerCell, type ExplorerSection } from "./explorer-data";
import { addPascalSpaces, addToArrayMap, compareProperty } from "../utils/helpers";
import Diagnostics from "./diagnostics";
import Settings from "lib/utils/settings";
import type ViewerMappings from "./viewer-mappings";
import type { StringTooltipInfo } from "./tooltip-info";
const { models, enums, formatting: fmt } = window.S4TK;
const { DiagnosticLevel, ValidationSchema } = window.S4TK.validation;

/**
 * Loads the given `resources` into `mappings` and `explorerSections`. It is
 * assummed that these have been cleared before calling this function, as
 * objects will just be added to them as-is.
 * 
 * @param resources List of validated resources to load
 * @param mappings Mappings to load with resources
 * @param explorerSections Array in which to append explorer sections
 */
export async function loadResources(
  resources: readonly ValidatedResource[],
  mappings: ViewerMappings,
  explorerSections: ExplorerSection[],
) {
  const sectionEntries = new Map<string, ValidatedResource[]>();
  const fileIdToInfoMap = mappings.fileIdToInfoMap as Map<number, ViewableFileInfo>;

  for (let id = 0; id < resources.length; ++id) {
    const entry = resources[id];
    const info = await _loadEntry(entry);
    fileIdToInfoMap.set(id, info);
    const sectionTitle = _getSectionTitle(entry);
    if (sectionTitle) addToArrayMap(sectionEntries, sectionTitle, entry);
  }

  const collapsed = !Settings.expandFoldersByDefault;
  sectionEntries.forEach((entries, title) => {
    const cells = entries
      .map(e => _createCell(e, mappings))
      .sort(compareProperty("filterName"));
    explorerSections.push({ title, cells, collapsed });
  });

  explorerSections.sort(compareProperty("title"));
}

//#region Info Loaders

async function _loadEntry(entry: ValidatedResource): Promise<ViewableFileInfo> {
  try {
    if (entry.isDeleted) return {
      renderType: RenderType.Deleted,
      id: entry.id,
      displayName: "Deleted Record",
      resourceKey: _getResourceKey(entry),
      diagnostics: _getDiagnostics(entry),
      extension: "binary",
      downloadData: entry.resource.getBuffer(),
    };

    switch (entry.schema) {
      case ValidationSchema.Tuning:
        return _tryLoadCorrupt("Tuning", entry) ?? _loadTuning(entry);
      case ValidationSchema.SimData:
        return _tryLoadCorrupt("SimData", entry) ?? _loadSimData(entry);
      case ValidationSchema.StringTable:
        return _tryLoadCorrupt("String Table", entry) ?? _loadStringTable(entry);
      default:
        return await _loadUnspecified(entry);
    }
  } catch (e) {
    // HACK: really should not be adding diagnostics on website...
    entry.diagnostics.push({
      ownerId: entry.id,
      code: "Unknown",
      level: DiagnosticLevel.Warning,
      message: "Something unexpected went wrong while loading this resource. It is possible that the issue is with the website, not the package. Please report this."
    });

    return {
      renderType: RenderType.Corrupt,
      id: entry.id,
      displayName: "Unexpected Error",
      resourceKey: _getResourceKey(entry),
      diagnostics: _getDiagnostics(entry),
      extension: "binary",
      downloadData: entry.resource.getBuffer(),
    };
  }
}

function _tryLoadCorrupt(
  displayName: string,
  entry: ValidatedResource
): ViewableFileInfo | undefined {
  if (!entry.modelLoaded) return {
    renderType: RenderType.Corrupt,
    id: entry.id,
    displayName: `Corrupt ${displayName}`,
    resourceKey: _getResourceKey(entry),
    diagnostics: _getDiagnostics(entry),
    extension: "binary",
    downloadData: entry.resource.getBuffer(),
  };
}

function _loadTuning(entry: ValidatedTuning): PlainTextFileInfo {
  const xml = entry.resource as modelsTypes.XmlResource;
  return {
    renderType: RenderType.PlainText,
    id: entry.id,
    displayName: entry.domValid
      ? xml.root.name ?? "Unnamed Tuning"
      : "Invalid Tuning",
    resourceKey: _getResourceKey(entry),
    diagnostics: _getDiagnostics(entry),
    language: "xml",
    textContent: xml.content,
    extension: "xml",
    downloadData: entry.resource.getBuffer(),
    tdescMetadata: entry.domValid
      ? ({
        class: xml.root.attributes["c"],
        type: xml.root.attributes["i"],
        module: xml.root.attributes["m"],
      })
      : undefined,
  };
}

function _loadSimData(entry: ValidatedSimData): PlainTextFileInfo {
  const simdata = entry.resource as modelsTypes.SimDataResource;
  const xmlContent = simdata.toXmlDocument().toXml();
  return {
    renderType: RenderType.PlainText,
    id: entry.id,
    displayName: simdata.instance.name ?? "Unnamed SimData",
    resourceKey: _getResourceKey(entry),
    diagnostics: _getDiagnostics(entry),
    language: "xml",
    textContent: xmlContent,
    extension: "SimData.xml",
    downloadData: window.NodeJS.Buffer.from(xmlContent),
  };
}

function _loadStringTable(entry: ValidatedStringTable): StringTableFileInfo {
  const stbl = entry.resource as modelsTypes.StringTableResource;
  const localeName = enums.StringTableLocale[entry.locale] ?? "Unknown";
  return {
    renderType: RenderType.StringTable,
    id: entry.id,
    displayName: `${localeName}`,
    resourceKey: _getResourceKey(entry),
    diagnostics: _getDiagnostics(entry),
    locale: entry.locale,
    entries: stbl.entries,
    extension: "stbl",
    downloadData: entry.resource.getBuffer()
  };
}

async function _loadUnspecified(entry: ValidatedResource): Promise<ViewableFileInfo> {
  switch (entry.key.type) {
    case enums.BinaryResourceType.DdsImage:
    case enums.BinaryResourceType.DstImage:
      return await _loadDdsImage(entry);
    case enums.BinaryResourceType.ObjectDefinition:
      return _loadObjectDefinition(entry);
    case enums.BinaryResourceType.PngImage:
      return await _loadPngImage(entry);
  }

  if (entry.modelLoaded) {
    if (entry.resource instanceof models.XmlResource) {
      return {
        renderType: RenderType.PlainText,
        id: entry.id,
        displayName: "Tuning (Suspected)",
        resourceKey: _getResourceKey(entry),
        diagnostics: _getDiagnostics(entry),
        language: "xml",
        textContent: entry.resource.content,
        extension: "xml",
        downloadData: entry.resource.getBuffer(),
      };
    } else if (entry.resource instanceof models.SimDataResource) {
      const xmlContent = entry.resource.toXmlDocument().toXml();
      return {
        renderType: RenderType.PlainText,
        id: entry.id,
        displayName: "SimData (Suspected)",
        resourceKey: _getResourceKey(entry),
        diagnostics: _getDiagnostics(entry),
        language: "xml",
        textContent: xmlContent,
        extension: "SimData.xml",
        downloadData: window.NodeJS.Buffer.from(xmlContent),
      };
    } else if (entry.resource instanceof models.StringTableResource) {
      return {
        renderType: RenderType.StringTable,
        id: entry.id,
        displayName: "String Table (Suspected)",
        resourceKey: _getResourceKey(entry, true),
        diagnostics: _getDiagnostics(entry),
        locale: enums.StringTableLocale.getLocale(entry.key.instance),
        entries: entry.resource.entries.map(({ key, value }) => ({ key, value })),
        extension: "stbl",
        downloadData: entry.resource.getBuffer()
      };
    }
  }

  return {
    renderType: RenderType.Unknown,
    id: entry.id,
    displayName: entry.key.type in enums.BinaryResourceType
      ? addPascalSpaces(enums.BinaryResourceType[entry.key.type])
      : "Unknown",
    resourceKey: _getResourceKey(entry),
    diagnostics: _getDiagnostics(entry),
    extension: "binary",
    downloadData: entry.resource.getBuffer()
  };
}

async function _loadDdsImage(entry: ValidatedResource): Promise<ViewableFileInfo> {
  const displayName = entry.key.type === enums.BinaryResourceType.DdsImage
    ? "DDS Image"
    : "DST Image";

  try {
    const dds = models.DdsImageResource.from(entry.resource.getBuffer());
    const jimp = dds.image.toJimp();
    const buffer = await jimp.getBufferAsync("image/png");
    const pngBase64 = "data:image/png;base64," + buffer.toString("base64");
    return {
      renderType: RenderType.Image,
      id: entry.id,
      displayName: displayName,
      resourceKey: _getResourceKey(entry),
      diagnostics: _getDiagnostics(entry),
      pngBase64: pngBase64,
      width: jimp.getWidth(),
      height: jimp.getHeight(),
      extension: "dds",
      downloadData: entry.resource.getBuffer(),
    };
  } catch (e) {
    console.error(`Failed to parse DDS image [${e}]`);
    return {
      renderType: RenderType.Corrupt,
      id: entry.id,
      displayName: `${displayName} (Unparsable)`,
      resourceKey: _getResourceKey(entry),
      diagnostics: _getDiagnostics(entry),
      extension: "dds",
      downloadData: entry.resource.getBuffer(),
    };
  }
}

async function _loadPngImage(entry: ValidatedResource): Promise<ViewableFileInfo> {
  try {
    const buffer = entry.resource.getBuffer();
    const pngBase64 = "data:image/png;base64," + buffer.toString("base64");
    return {
      renderType: RenderType.Image,
      id: entry.id,
      displayName: "PNG Image",
      resourceKey: _getResourceKey(entry),
      diagnostics: _getDiagnostics(entry),
      pngBase64: pngBase64,
      extension: "png",
      downloadData: entry.resource.getBuffer(),
    };
  } catch (e) {
    console.error(`Failed to parse PNG image [${e}]`);
    return {
      renderType: RenderType.Corrupt,
      id: entry.id,
      displayName: `PNG Image (Unparsable)`,
      resourceKey: _getResourceKey(entry),
      diagnostics: _getDiagnostics(entry),
      extension: "png",
      downloadData: entry.resource.getBuffer(),
    };
  }
}

function _loadObjectDefinition(entry: ValidatedResource): ViewableFileInfo {
  try {
    const def = models.ObjectDefinitionResource.from(entry.resource.getBuffer());
    return {
      renderType: RenderType.PlainText,
      id: entry.id,
      displayName: def.properties.name ?? "Unnamed Object Definition",
      resourceKey: _getResourceKey(entry),
      diagnostics: _getDiagnostics(entry),
      language: "json",
      textContent: JSON.stringify(def.properties, (_, value) => {
        return typeof value === "bigint" || typeof value === "number"
          ? value.toString() : value;
      }, 2),
      extension: "binary",
      downloadData: entry.resource.getBuffer()
    };
  } catch (e) {
    console.error(`Failed to parse object definition [${e}]`);
    return {
      renderType: RenderType.Corrupt,
      id: entry.id,
      displayName: "Object Definition (Unparsable)",
      resourceKey: _getResourceKey(entry),
      diagnostics: _getDiagnostics(entry),
      extension: "binary",
      downloadData: entry.resource.getBuffer()
    };
  }
}

//#endregion

//#region Cell Loaders

function _createCell(
  entry: ValidatedResource,
  mappings: ViewerMappings
): ExplorerCell {
  let info = mappings.fileIdToInfoMap.get(entry.id);

  if (entry.isDeleted) return {
    displayType: DisplayType.Unspecified,
    filterName: info.displayName,
    containedIds: new Set([info.id]),
    defaultId: info.id,
    info: info,
  };

  switch (entry.schema) {
    case ValidationSchema.Tuning: {
      info = info as PlainTextFileInfo;
      _addFileTooltip(mappings, entry.key.instance.toString(), info.id);
      const simDataInfo = mappings.fileIdToInfoMap.get(entry.pairedSimDataId) as PlainTextFileInfo;
      const containedIds = new Set([info.id]);
      if (simDataInfo) containedIds.add(simDataInfo.id);
      return {
        displayType: DisplayType.Tuning,
        filterName: info.displayName,
        defaultId: info.id,
        containedIds: containedIds,
        tuningInfo: info,
        simDataInfo: simDataInfo
      };
    }
    case ValidationSchema.StringTable: {
      info = info as StringTableFileInfo;
      if (info.locale === enums.StringTableLocale.English) {
        info.entries.forEach(({ key, value }) => {
          _addStringTooltip(mappings, key, info.id, value);
        });
      }
      return {
        displayType: DisplayType.StringTable,
        filterName: "String Table",
        defaultId: info.id,
        containedIds: new Set([info.id, ...entry.otherLocaleIds]),
        sharedResourceKey: _getResourceKey(entry, true),
        localeChoices: [info.id, ...entry.otherLocaleIds]
          .map(id => mappings.fileIdToInfoMap.get(id) as StringTableFileInfo),
        chosenLocaleIndex: 0,
      };
    }
  }

  _addFileTooltip(mappings, info.resourceKey, info.id);
  return {
    displayType: DisplayType.Unspecified,
    filterName: info.displayName,
    containedIds: new Set([info.id]),
    defaultId: info.id,
    info: info,
  };
}

//#endregion

//#region Helpers

function _getSectionTitle(entry: ValidatedResource): string | undefined {
  switch (entry.schema) {
    case ValidationSchema.SimData: {
      if (entry.pairedTuningId !== undefined) return;
      const groupName = enums.SimDataGroup[entry.key.group] ?? "Unknown";
      return `${addPascalSpaces(groupName)} SimData`;
    }
    case ValidationSchema.StringTable: {
      return entry.primary ? "String Table" : undefined;
    }
    case ValidationSchema.Tuning: {
      if (entry.key.type === enums.TuningResourceType.Tuning) {
        return "Module Tuning";
      } else {
        const typeName = enums.TuningResourceType[entry.key.type] ?? "Unknown";
        return `${addPascalSpaces(typeName)} Tuning`;
      }
    }
  }

  if (!(entry.key.type in enums.BinaryResourceType)) return "Unknown";

  switch (entry.key.type) {
    case enums.BinaryResourceType.DdsImage:
    case enums.BinaryResourceType.DstImage:
    case enums.BinaryResourceType.ObjectDefinition:
    case enums.BinaryResourceType.PngImage:
      return addPascalSpaces(enums.BinaryResourceType[entry.key.type]);
    default:
      return "Unsupported";
  }
}

function _getDiagnostics(entry: ValidatedResource): readonly DiagnosticInfo[] {
  return entry.diagnostics.sort(Diagnostics.sorter);
}

function _getResourceKey(entry: ValidatedResource, removeLocale = false): string {
  if (removeLocale) {
    const instanceBase = enums.StringTableLocale.getInstanceBase(entry.key.instance);
    const typeStr = fmt.formatResourceType(entry.key.type);
    const groupStr = fmt.formatResourceGroup(entry.key.group);
    const instanceBaseStr = fmt.formatAsHexString(instanceBase, 14, false);
    return `${typeStr}-${groupStr}-XX${instanceBaseStr}`;
  } else {
    return fmt.formatResourceKey(entry.key, "-");
  }
}

function _addFileTooltip(mappings: ViewerMappings, key: string, fileId: number) {
  const fileKeyToIdMap = mappings.fileKeyToIdMap as Map<string, number>;
  fileKeyToIdMap.set(key, fileId);
}

function _addStringTooltip(mappings: ViewerMappings, key: number, stblId: number, text: string) {
  const stringKeyToTooltipMap = mappings.stringKeyToTooltipMap as Map<number, StringTooltipInfo>;
  stringKeyToTooltipMap.set(key, { stblId, text });
}

//#endregion
