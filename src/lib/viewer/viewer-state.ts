import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { ViewableFileInfo } from "./viewable-file-info";
import type { ExplorerSection } from "./explorer-data";
import ViewerEvents from "./viewer-events";
import { loadResources } from "./resource-loader";
const { validatePackageBuffer } = window.S4TK.validation;

class _ViewerState {
  //#region Fields / Properties

  private _cachedPackageName: string;
  private _cachedPackageBuffer: Buffer;
  private readonly _fileInfoMap = new Map<number, ViewableFileInfo>();
  private _explorerSections: ExplorerSection[];
  private _viewedFileId = 0;
  private _searchTerm: string;

  private get _viewedFile() { return this._fileInfoMap.get(this._viewedFileId); }

  //#endregion

  //#region Lifecycle

  /**
   * Loads a package from the given buffer into the viewer.
   * 
   * @param buffer Buffer containing package data
   * @param filename Name of package file
   */
  async loadPackage(buffer: Buffer, filename: string): Promise<boolean> {
    this.unloadPackage();

    try {
      const resources = validatePackageBuffer(buffer);
      if (resources.length < 1) return false;
      await loadResources(resources, this._fileInfoMap, this._explorerSections);
      this._cachedPackageName = filename;
      this._cachedPackageBuffer = buffer;
      this._viewedFileId = this._explorerSections[0]?.cells[0]?.defaultId ?? 0;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    } finally {
      this.requestRefresh();
    }
  }

  /**
   * Resets the viewer to prepare for another upload.
   * 
   * @param options Optional arguments
   */
  unloadPackage(options?: {
    requestRefresh: boolean;
  }) {
    this._cachedPackageName = null;
    this._cachedPackageBuffer = null;
    this._viewedFileId = 0;
    this._fileInfoMap.clear();
    this._explorerSections = [];
    this._searchTerm = "";
    if (options?.requestRefresh) {
      this.requestRefresh();
      ViewerEvents.onPackageUnloaded.notify();
    }
  }

  //#endregion

  //#region Public Methods

  /**
   * Retrieves a file by its ID.
   * 
   * @param id ID of file to get
   */
  getFile(id: number): ViewableFileInfo {
    return this._fileInfoMap.get(id);
  }

  /**
   * Downloads the file with the given ID.
   * 
   * @param id ID of file to download
   */
  downloadFile(id: number) {
    const file = this.getFile(id);
    const resourceKey = file.resourceKey.replace(/-/g, "_");
    const displayName = file.displayName.replace(/[^a-z0-9_-]/gi, "_");
    if (file) saveAs(
      new Blob([file.downloadData]),
      `${resourceKey}.${displayName}.${file.extension}`
    );
  }

  /**
   * Downloads the current viewed file.
   */
  downloadCurrentFile() {
    this.downloadFile(this._viewedFileId);
  }

  /**
   * Downloads all files as a ZIP.
   */
  async downloadAllFiles() {
    const zip = new JSZip();

    this._fileInfoMap.forEach(info => {
      const resourceKey = info.resourceKey.replace(/-/g, "_");
      const displayName = info.displayName.replace(/[^a-z0-9_-]/gi, "_");
      const filename = `${resourceKey}.${displayName}.${info.extension}`;
      zip.file(filename, info.downloadData);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, this._cachedPackageName.replace(".package", ".zip"));
  }

  /**
   * Downloads the current saved package, if there is one.
   */
  downloadCurrentPackage() {
    if (this._cachedPackageBuffer) saveAs(
      new Blob([this._cachedPackageBuffer]),
      this._cachedPackageName ?? "Download.package"
    );
  }

  /**
   * Requests a file with the given ID to be shown.
   * 
   * @param id ID of file to display
   * @param fromUser Whether the request is from the user
   */
  requestFile(id: number, fromUser: boolean) {
    if (this._fileInfoMap.has(id)) {
      this._viewedFileId = id;
      ViewerEvents.onViewedFileChange.notify(this._viewedFile);
      if (fromUser) ViewerEvents.onUserClickedFile.notify();
    } else {
      console.error(`Cannot switch to entry ${id} because it does not exist.`);
    }
  }

  /**
   * Re-emits events for all current states.
   */
  requestRefresh() {
    ViewerEvents.onExplorerSectionsChange.notify(this._explorerSections);
    ViewerEvents.onViewedFileChange.notify(this._viewedFile);
    ViewerEvents.onSearchTermChange.notify(this._searchTerm);
    ViewerEvents.onPackageNameChange.notify(this._cachedPackageName);
  }

  /**
   * Requests a new search term to filter files by.
   * 
   * @param term Term to search by
   */
  requestSearch(term: string) {
    this._searchTerm = term ?? "";
    ViewerEvents.onSearchTermChange.notify(term);
  }

  //#endregion
}

const ViewerState = new _ViewerState();
export default ViewerState;
