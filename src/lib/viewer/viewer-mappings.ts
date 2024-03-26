import type { ViewableFileInfo, StringEntryInfo } from "./index-data-types";

export default class ViewerMappings {
  private readonly _fileIdToInfoMap = new Map<number, ViewableFileInfo>();
  get fileIdToInfoMap(): ReadonlyMap<number, ViewableFileInfo> { return this._fileIdToInfoMap; };

  private readonly _fileKeyToIdMap = new Map<string, number>();
  get fileKeyToIdMap(): ReadonlyMap<string, number> { return this._fileKeyToIdMap; };

  private readonly _stringKeyToInfoMap = new Map<number, StringEntryInfo>();
  get stringKeyToInfoMap(): ReadonlyMap<number, StringEntryInfo> { return this._stringKeyToInfoMap; };

  /**
   * Clears the contents of all contained maps.
   */
  clear() {
    this._fileIdToInfoMap.clear();
    this._fileKeyToIdMap.clear();
    this._stringKeyToInfoMap.clear();
  }

  /**
   * Returns the `ViewableFileInfo` for the file with the given ID.
   * 
   * @param id ID of file to get
   */
  getFileInfo(id: number): ViewableFileInfo {
    return this._fileIdToInfoMap.get(id);
  }

  /**
   * Returns the `ViewableFileInfo` for the file with the given key. Tuning keys
   * should be decimal instances, and other resource types should be full hex
   * resource keys using "-" to separate TGI values.
   * 
   * @param key Resource key of file to get
   */
  getFileInfoByKey(key: string): ViewableFileInfo {
    return this.getFileInfo(this._fileKeyToIdMap.get(key));
  }

  /**
   * Returns the `StringEntryInfo` for the string with the given key. Keys
   * should be numbers or 32-bit hex strings.
   * 
   * @param key Key of string to get
   */
  getStringInfo(key: number | string): StringEntryInfo {
    if (typeof key === "string") key = parseInt(key, 16);
    if (isNaN(key)) return undefined;
    return this._stringKeyToInfoMap.get(key);
  }
}
