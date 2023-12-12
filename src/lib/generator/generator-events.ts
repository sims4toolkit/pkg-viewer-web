import EventNotifier from "../utils/event-notifier";
import type { GeneratedFilesData, GlobalSettings } from "./types";

const GeneratorEvents = {
  onPreviewingPackageChange: new EventNotifier<boolean>(),
  onPackagePreviewReadyChange: new EventNotifier<boolean>(),
  onFileDataChange: new EventNotifier<GeneratedFilesData>(),
  onGlobalSettingsChange: new EventNotifier<GlobalSettings>(),
};

export default GeneratorEvents;
