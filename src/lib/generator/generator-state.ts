import type { Package } from "@s4tk/models";
import type { ResourceKey } from "@s4tk/models/types";
import defaultTemplateData from "data/default-templates.json";
import GeneratorDB from "./generator-db";
import type { GeneratedFileEntryData, GeneratedFilesData, GlobalSettings } from "./types";
import ViewerState from "lib/viewer/viewer-state";
import GeneratorEvents from "./generator-events";
const { models, hashing, enums } = window.S4TK;

class _GeneratorState {
  //#region Fields / Properties

  private _initialized: boolean = false;
  private _isPreviewingPackage: boolean = false;
  private _isPackagePreviewReady: boolean = false;
  private _fileData: GeneratedFilesData;
  private _globalSettings: GlobalSettings;

  //#endregion

  //#region Lifecycle

  async initializeFromStorage() {
    try {
      if (this._initialized) return;
      const data = await GeneratorDB.fetchData();
      if (data) {
        this._fileData = data.fileData;
        this._globalSettings = data.globalSettings;
      } else {
        this._createDefaultData();
      }
      this._initialized = true;
    } catch (e) {
      console.error(e);
      this._createDefaultData();
    } finally {
      GeneratorEvents.onFileDataChange.notify(this._fileData);
      GeneratorEvents.onGlobalSettingsChange.notify(this._globalSettings);
    }
  }

  async saveToStorage() {
    try {
      await GeneratorDB.saveData({
        fileData: this._fileData,
        globalSettings: this._globalSettings,
      });
    } catch (e) {
      console.error(e);
    }
  }

  //#endregion

  //#region Public Methods

  async requestPreviewer() {
    if (!(this._fileData && this._globalSettings)) return;
    try {
      this._isPreviewingPackage = true;
      GeneratorEvents.onPreviewingPackageChange.notify(true);
      this._isPackagePreviewReady = false;
      GeneratorEvents.onPackagePreviewReadyChange.notify(false);

      const pkg = this._buildPackage();
      if (!pkg) {
        alert(
          "Could not build package. There is most likely a syntax error in one of your templates. Check the console for the full call stack."
        );
        this._isPreviewingPackage = false;
        return;
      }

      const success = ViewerState.loadPackage(
        pkg.getBuffer(),
        "Generated.package"
      );

      if (success) this._isPackagePreviewReady = true;
    } catch (e) {
      this._isPreviewingPackage = false;
    } finally {
      GeneratorEvents.onPreviewingPackageChange.notify(this._isPreviewingPackage);
      GeneratorEvents.onPackagePreviewReadyChange.notify(this._isPackagePreviewReady);
    }
  }

  async requestBuilder() {
    if (!(this._fileData && this._globalSettings)) return;
    this._isPreviewingPackage = false;
    this._isPackagePreviewReady = false;
    GeneratorEvents.onPreviewingPackageChange.notify(false);
    GeneratorEvents.onPackagePreviewReadyChange.notify(false);
  }

  //#endregion

  //#region Private Methods

  private _buildPackage(): Package | undefined {
    try {
      const pkg = new models.Package();

      this._fileData.entries.forEach((file) => {
        const template = this._globalSettings.templateData.templates.find(
          (t) => t.id === file.templateId
        );

        const filename = this._globalSettings.filenamePrefix + file.filename;

        const tuningKey = this._getKey(file, "tuning");
        const tuning = new models.XmlResource(template.tuning);
        tuning.updateRoot((root) => {
          root.name = filename;
          root.id = tuningKey.instance.toString();
        });
        pkg.add(tuningKey, tuning);

        if (file.hasSimData) {
          const simdata = models.SimDataResource.fromXml(template.simdata);
          simdata.instance.name = filename;
          pkg.add(this._getKey(file, "simdata"), simdata);
        }
      });

      return pkg;
    } catch (e) {
      console.error("Could not generate package:", e);
    }
  }

  private _getKey(
    file: GeneratedFileEntryData,
    kind: "tuning" | "simdata"
  ): ResourceKey {
    const type = file.manualKey?.type ?? file.type;
    const instance =
      file.manualKey?.instance ??
      BigInt(
        (file.use32bit ? hashing.fnv32 : hashing.fnv64)(
          this._globalSettings.filenamePrefix + file.filename,
          file.useHighBit
        )
      );

    if (kind === "tuning") {
      return (
        file.manualKey ?? {
          type,
          group: 0,
          instance,
        }
      );
    } else {
      return {
        type: enums.BinaryResourceType.SimData,
        group: enums.SimDataGroup.getForTuning(type),
        instance,
      };
    }
  }

  private _createDefaultData() {
    this._fileData = {
      nextId: 0,
      entries: [],
    };

    this._globalSettings = {
      filenamePrefix: "",
      all32bit: false,
      allHighBit: false,
      templateData: defaultTemplateData,
    };
  }

  //#endregion
}

const GeneratorState = new _GeneratorState();
export default GeneratorState;
