export default class ViewerBreadcrumbs {
  private _currentFileId: number = -1;
  private readonly _history: number[] = [];
  private readonly _future: number[] = [];

  get currentFileId() { return this._currentFileId; }
  get canGoBack() { return this._history.length > 0; }
  get canGoNext() { return this._future.length > 0; }

  /**
   * Manually sets the ID of the current file.
   * 
   * @param id ID of file to view
   */
  updateFile(id: number) {
    this._history.push(this._currentFileId);
    this._currentFileId = id;
    this._future.length = 0;
  }

  /**
   * Attempts to change the current file to the next in the history list.
   */
  tryGoBack(): boolean {
    if (!this.canGoBack) return false;
    this._future.push(this._currentFileId);
    this._currentFileId = this._history.pop();
    return true;
  }

  /**
   * Attempts to change the current file to the next in the future list.
   */
  tryGoNext(): boolean {
    if (!this.canGoNext) return false;
    this._history.push(this._currentFileId);
    this._currentFileId = this._future.pop();
    return true;
  }

  /**
   * Resets the breadcrumbs.
   * 
   * @param initialFileId Initial file to load
   */
  reset(initialFileId?: number) {
    this._currentFileId = initialFileId ?? -1;
    this._history.length = 0;
    this._future.length = 0;
  }
}
