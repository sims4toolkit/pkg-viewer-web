import type { TuningResourceType } from "@s4tk/models/enums";
const { enums } = window.S4TK;

interface _FetchedData {
  readonly endpoint: string;
}

interface FetchedStringData extends _FetchedData {
  readonly pack: string;
  readonly text: string;
}

interface FetchedTuningData extends _FetchedData {
  readonly name: string;
  readonly type: TuningResourceType;
  readonly group: string;
}

interface FetchedImageData extends _FetchedData {
  readonly source: string;
}

namespace ExternalTooltips {
  const _API_BASE = "https://tdesc.lot51.cc/api/simdex";

  /**
   * Returns a `FetchedStringData` for the string with the given key.
   * 
   * @param key Key of string (must be hex with 0x prefix)
   */
  export async function fetchStringData(key: string): Promise<FetchedStringData | null> {
    try {
      const endpoint = getEndpoint(`search/strings?q=${key}&offset=0&limit=1&locales[]=0`);
      const res = await fetch(endpoint);
      if (!res.ok) return null;
      const { value, pack } = await _getFirstHit(res);
      return { text: value, pack, endpoint };
    } catch (e) {
      console.error(`Error fetching string '${key}':`, e);
      return null;
    }
  }

  /**
   * Returns a `FetchedTuningData` for the tuning with the given instance.
   * 
   * @param instance Instance of tuning (must be decimal)
   */
  export async function fetchTuningData(instance: string): Promise<FetchedTuningData | null> {
    try {
      const endpoint = getEndpoint(`search/tuning?q=${instance}&offset=0&limit=1`);
      const res = await fetch(endpoint);
      if (!res.ok) return null;
      const { instance_id, instance_type, group_id_hash, name } = await _getFirstHit(res);
      if (instance_id !== instance) return null;
      const type = enums.TuningResourceType.parseAttr(instance_type);
      return { type, name, group: group_id_hash, endpoint };
    } catch (e) {
      console.error(`Error fetching tuning '${instance}':`, e);
      return null;
    }
  }

  /**
   * Returns a `FetchedImageData` for an image with the given resource key.
   * This does *not* actually fetch the image, but rather returns a URL from
   * where the image can be fetched.
   * 
   * @param resKey Resource key of the DDS or DST image (must be hex TGI)
   */
  export async function fetchImageData(resKey: string): Promise<FetchedImageData | null> {
    try {
      resKey = resKey.toUpperCase().replace(/:/g, "-").replace(/^2F7D0004/, "00B2D882");
      if (!resKey.startsWith("00B2D882")) return null;
      const instance = resKey.split("-")[2];
      const source = `https://tdesc.lot51.cc/api/simdex/icon/0x${instance}`;
      return { source, endpoint: source };
    } catch (e) {
      console.error(`Error fetching image '${resKey}':`, e);
      return null;
    }
  }

  function getEndpoint(path: string): string {
    return `${_API_BASE}/${path}`;
  }

  async function _getFirstHit(res: Response): Promise<any> {
    const json = await res.json();
    const firstHit = json.hits.hits[0];
    return firstHit._source;
  }
}

export default ExternalTooltips;
