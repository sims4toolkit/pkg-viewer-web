<script lang="ts">
  import { onDestroy } from "svelte";
  import type { Package } from "@s4tk/models";
  import type { ResourceKey } from "@s4tk/models/types";
  import type { GeneratedFileData, GlobalSettings } from "./types";
  import defaultTemplateData from "../../../data/default-templates.json";
  import PkgBuilderView from "./PkgBuilderView.svelte";
  import PkgViewer from "../viewer/PkgViewer.svelte";
  import IconTextButton from "../../shared/IconTextButton.svelte";
  import { subscribeToKey } from "../../../typescript/keybindings";
  const { models, enums, hashing } = window.S4TK;

  let isViewingPackage = false;
  let pkg: Package;
  let fileData: GeneratedFileData[] = [];
  let nextEntryId = 0;
  let globalSettings: GlobalSettings = {
    filenamePrefix: "",
    all32bit: false,
    allHighBit: false,
    templateData: defaultTemplateData,
  };

  const keySubscriptions = [
    subscribeToKey("b", togglePkgView, {
      ctrlOrMeta: true,
      preventDefault: true,
    }),
  ];

  onDestroy(() => {
    keySubscriptions.forEach((unsub) => unsub());
  });

  function getKey(
    file: GeneratedFileData,
    kind: "tuning" | "simdata"
  ): ResourceKey {
    const type = file.manualKey?.type ?? file.type;
    const instance =
      file.manualKey?.instance ??
      BigInt(
        (file.use32bit ? hashing.fnv32 : hashing.fnv64)(
          globalSettings.filenamePrefix + file.filename,
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

  function buildPackage(): Package {
    try {
      const pkg = new models.Package();

      fileData.forEach((file) => {
        const template = globalSettings.templateData.templates.find(
          (t) => t.id === file.templateId
        );

        const tuningKey = getKey(file, "tuning");
        const tuning = new models.XmlResource(template.tuning);
        tuning.updateRoot((root) => {
          root.name = file.filename;
          root.id = tuningKey.instance.toString();
        });
        pkg.add(tuningKey, tuning);

        if (file.hasSimData) {
          const simdata = models.SimDataResource.fromXml(template.simdata);
          simdata.instance.name = file.filename;
          pkg.add(getKey(file, "simdata"), simdata);
        }
      });

      return pkg;
    } catch (e) {
      console.log("Could not generate package:", e);
    }
  }

  function togglePkgView() {
    if (isViewingPackage) {
      isViewingPackage = false;
    } else {
      pkg = buildPackage();
      if (pkg) isViewingPackage = true;
    }
  }
</script>

<svelte:head>
  <title>Package Generator</title>
</svelte:head>

<div class="toggle-pkg-view-btn">
  <IconTextButton
    icon={isViewingPackage ? "pencil" : "hammer"}
    text={isViewingPackage ? "Edit" : "Build"}
    onClick={togglePkgView}
    useBg={true}
  />
</div>

{#if isViewingPackage}
  <PkgViewer pkgName="Generated.package" {pkg} />
{:else}
  <PkgBuilderView bind:fileData bind:nextEntryId bind:globalSettings />
{/if}

<style lang="scss">
  .toggle-pkg-view-btn {
    z-index: 1024;
    position: fixed;
    top: 75px;
    right: 25px;
  }
</style>
