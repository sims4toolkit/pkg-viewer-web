import EventNotifier from "../utils/event-notifier";
import type { ExplorerSection } from "./explorer-data";
import type { ViewableFileInfo } from "./index-data-types";

const ViewerEvents = {
  onExplorerSectionsChange: new EventNotifier<readonly ExplorerSection[]>(),
  onViewedFileChange: new EventNotifier<ViewableFileInfo>(),
  onSearchTermChange: new EventNotifier<string>(),
  onUserClickedFile: new EventNotifier<void>(),
  onPackageNameChange: new EventNotifier<string>(),
  onPackageUnloaded: new EventNotifier<void>(),
};

export default ViewerEvents;
