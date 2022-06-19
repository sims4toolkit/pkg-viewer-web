import type { Package, SimDataResource, StringTableResource, XmlResource } from "@s4tk/models";
import type { ResourceKeyPair } from "@s4tk/models/types";

const { BinaryResourceType, TuningResourceType, SimDataGroup, StringTableLocale, EncodingType } = window.S4TK.enums;
const { formatAsHexString, formatResourceInstance, formatStringKey, formatResourceKey } = window.S4TK.formatting;
const { fnv64 } = window.S4TK.hashing;

const BIT32_CLASSES = new Set([
  'Preference',
  'Reward',
  'HouseholdReward',
  'SimReward',
  'RelationshipBit',
  'SocialContextBit',
  'Aspiration',
  'AspirationAssignment',
  'AspirationBasic',
  'AspirationCareer',
  'AspirationGig',
  'AspirationFamilialTrigger',
  'AspirationNotification',
  'AspirationOrganizationTask',
  'AspirationSimInfoPanel',
  'AspirationWhimSet',
  'ObjectivelessWhimSet',
  'TimedAspiration',
  'ZoneDirectorEventListener',
]);

export function getTypeDisplay(type: number, group?: number): string {
  if (type === BinaryResourceType.SimData) {
    return group in SimDataGroup
      ? `${useSpaces(SimDataGroup[group])} SimData`
      : "SimData";
  } else if (type in TuningResourceType) {
    if (type === TuningResourceType.Tuning) return "Generic Tuning";
    return useSpaces(TuningResourceType[type]) + " Tuning";
  } else if (type in BinaryResourceType) {
    return useSpaces(BinaryResourceType[type]);
  } else {
    return "Type " + formatAsHexString(type, 8, false);
  }
}

export function getDisplayName(entry: ResourceKeyPair): string {
  switch (entry.value.encodingType) {
    case EncodingType.XML:
      return (entry.value as XmlResource).root.name;
    case EncodingType.DATA:
      return (entry.value as SimDataResource).instance.name;
    case EncodingType.STBL:
      const locale =
        StringTableLocale[StringTableLocale.getLocale(entry.key.instance)];
      return locale + " String Table";
    default:
      return "Unknown";
  }
}

export function isEncodingSupported(type: number): boolean {
  return (
    type === BinaryResourceType.StringTable ||
    type === BinaryResourceType.SimData ||
    type in TuningResourceType
  );
}

export function scanPackageForWarnings(pkg: Package): Map<number, string[]> {
  const allWarnings = new Map<number, string[]>;
  const seenKeys = new Set<string>();

  pkg.entries.forEach(entry => {
    try {
      const warnings = scanEntryForWarnings(entry, seenKeys);
      if (warnings.length) allWarnings.set(entry.id, warnings);
    } catch (err) {
      allWarnings.set(entry.id, ["Something is wrong, but I honestly don't know what it is. Godspeed."]);
    }
  });

  return allWarnings;
}

function scanEntryForWarnings(entry: ResourceKeyPair, seenKeys: Set<string>): string[] {
  const warnings: string[] = [];

  const formattedKey = formatResourceKey(entry.key, "-");
  if (seenKeys.has(formattedKey)) {
    warnings.push(`The key ${formattedKey} is already in use by another resource.`)
  } else {
    seenKeys.add(formattedKey);
  }

  if (entry.key.type === BinaryResourceType.SimData) {
    // TODO:
  } else if (entry.key.type === BinaryResourceType.StringTable) {
    const stbl = entry.value as StringTableResource;

    const repeatedKeys = stbl.findRepeatedKeys()
    if (repeatedKeys.length) {
      warnings.push(`Found repeated keys: [${repeatedKeys.map(formatStringKey).join(", ")}]`);
    }

    if (stbl.hasValue("")) {
      warnings.push("At least one string is empty.");
    }
  } else if (entry.key.type in TuningResourceType) {
    const xml = entry.value as XmlResource;

    try {
      xml.root;
    } catch (err) {
      console.error(err);
      warnings.push(`XML could not be parsed. ${err}`);
      return;
    }

    if (xml.root.tag === "I") {
      if (BIT32_CLASSES.has(xml.root.attributes.c) && (entry.key.instance > 0xFFFFFFFFn))
        warnings.push(`The class "${xml.root.attributes.c}" is known to require a 32-bit instance, but this resource has a 64-bit instance. You might want to replace ${formatAsHexString(entry.key.instance, 16)} with ${formatAsHexString(entry.key.instance & 0xFFFFFFFFn, 8)}.`);

      if (TuningResourceType.parseAttr(xml.root.attributes.i) !== entry.key.type) {
        warnings.push(`Type of "${TuningResourceType[entry.key.type]}" is incompatible with i="${xml.root.attributes.i}". Either the type should be "${TuningResourceType[TuningResourceType.parseAttr(xml.root.attributes.i)]}", or the i attribute should be "${TuningResourceType.getAttr(entry.key.type)}".`);
      }
    } else if (xml.root.tag === "M") {
      const expectedHash = fnv64(xml.root.name.replace(/\./g, "-"));
      if (BigInt(xml.root.id as string) !== expectedHash) {
        warnings.push(`Module instance does not match its name. It must be the FNV-64 hash of the filename with all '.' characters are replaced with '-', which is ${expectedHash}.`);
      }
    }

    if (BigInt(xml.root.id as string) !== entry.key.instance) {
      warnings.push(`Instance "${formatResourceInstance(entry.key.instance)}" does not match s="${xml.root.id}".`);
    }
  }

  return warnings;
}

function useSpaces(name: string): string {
  return name.replace(/([A-Z])/g, " $1");
}
