<script lang="ts">
  import type { Package } from "@s4tk/models";
  import type { ResourceKey } from "@s4tk/models/types";
  import type { GeneratedFileData, GlobalSettings } from "./types";
  import defaultTemplateData from "../../../data/default-templates.json";
  import PkgBuilderView from "./PkgBuilderView.svelte";
  import PkgViewer from "../viewer/PkgViewer.svelte";
  import IconButton from "../../shared/IconButton.svelte";
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

{#if isViewingPackage}
  <PkgViewer pkgName="GeneratedTuning.package" {pkg} />
{:else}
  <PkgBuilderView bind:fileData bind:nextEntryId bind:globalSettings />
{/if}

<div class="toggle-pkg-view-btn">
  <IconButton
    icon="eye"
    title="View Package"
    onClick={togglePkgView}
    useBg={true}
  />
</div>

<style lang="scss">
  .toggle-pkg-view-btn {
    position: fixed;
    bottom: 25px;
    left: 25px;
  }
</style>
