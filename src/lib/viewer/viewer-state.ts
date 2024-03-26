import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { ExplorerSection } from "./explorer-data";
import ViewerEvents from "./viewer-events";
import { loadResources } from "./resource-loader";
import ViewerMappings from "./viewer-mappings";
import ViewerBreadcrumbs from "./viewer-breadcrumbs";
const { validatePackageBuffer } = window.S4TK.validation;

class _ViewerState {
  //#region Fields / Properties

  public readonly mappings = new ViewerMappings();
  private readonly _breadcrumbs = new ViewerBreadcrumbs();
  private _cachedPackageName: string;
  private _cachedPackageBuffer: Buffer;
  private _explorerSections: ExplorerSection[];
  private _searchTerm: string;

  public get canGoBack() { return this._breadcrumbs.canGoBack; }
  public get canGoNext() { return this._breadcrumbs.canGoNext; }
  private get _currentFileId() { return this._breadcrumbs.currentFileId; }
  private get _currentFileInfo() { return this.mappings.getFileInfo(this._currentFileId); }

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
      await loadResources(resources, this.mappings, this._explorerSections);
      this._cachedPackageName = filename;
      this._cachedPackageBuffer = buffer;
      const initialFileId = this._explorerSections[0]?.cells[0]?.defaultId ?? 0;
      this._breadcrumbs.reset(initialFileId);
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
    this.mappings.clear();
    this._breadcrumbs.reset();
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
   * Downloads the file with the given ID.
   * 
   * @param id ID of file to download
   */
  downloadFile(id: number) {
    const file = this.mappings.getFileInfo(id);
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
    this.downloadFile(this._currentFileId);
  }

  /**
   * Downloads all files as a ZIP.
   */
  async downloadAllFiles() {
    const zip = new JSZip();

    this.mappings.fileIdToInfoMap.forEach(info => {
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
    if (id === this._currentFileId) return;
    if (!this.mappings.fileIdToInfoMap.has(id)) {
      console.error(`Cannot switch to entry ${id} because it does not exist.`);
      return;
    }

    this._breadcrumbs.updateFile(id);
    ViewerEvents.onViewedFileChange.notify(this._currentFileInfo);
    if (fromUser) ViewerEvents.onUserClickedFile.notify();
  }

  /**
   * Requests the previous file in the file history.
   * 
   * @param fromUser Whether the request is from the user
   */
  requestPreviousFile(fromUser: boolean) {
    if (!this._breadcrumbs.tryGoBack()) return;
    ViewerEvents.onViewedFileChange.notify(this._currentFileInfo);
    if (fromUser) ViewerEvents.onUserClickedFile.notify();
  }

  /**
   * Requests the next file in the file history.
   * 
   * @param fromUser Whether the request is from the user
   */
  requestNextFile(fromUser: boolean) {
    if (!this._breadcrumbs.tryGoNext()) return;
    ViewerEvents.onViewedFileChange.notify(this._currentFileInfo);
    if (fromUser) ViewerEvents.onUserClickedFile.notify();
  }

  /**
   * Re-emits events for all current states.
   */
  requestRefresh() {
    ViewerEvents.onExplorerSectionsChange.notify(this._explorerSections);
    ViewerEvents.onViewedFileChange.notify(this._currentFileInfo);
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
