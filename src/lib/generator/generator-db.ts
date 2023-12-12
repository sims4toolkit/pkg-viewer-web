import type { StoredGeneratorData } from "./types";

namespace GeneratorDB {
  //#region Variables

  let _generatorDB: IDBDatabase;

  //#endregion

  //#region Public Functions

  /**
   * Retrieves all data in the generator DB, if there is any.
   */
  export async function fetchData(): Promise<StoredGeneratorData> {
    return new Promise(async (resolve, reject) => {
      if (!_generatorDB) await _initializeGeneratorDB();

      const request = _generatorDB
        .transaction("data", "readonly")
        .objectStore("data")
        .get(0);

      request.onerror = () => {
        reject("Could not fetch data.");
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  /**
   * Saves the given data to the DB.
   * 
   * @param data Data to save to DB
   */
  export async function saveData(data: StoredGeneratorData): Promise<void> {
    if (!_generatorDB) await _initializeGeneratorDB();

    _generatorDB
      .transaction("data", "readwrite")
      .objectStore("data")
      .put(data, 0);
  }

  //#endregion

  //#region Private Functions

  async function _initializeGeneratorDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("PackageGeneratorDB", 1);

      request.onerror = () => {
        alert("Your browser does not support indexed databases, which means your work in the package generator will not be saved. Make sure you do not navigate away from this page, or you will lose your progress.");
      };

      const loadDb = async (event: any) => {
        _generatorDB = event.target.result;
        _generatorDB.onerror = (event: any) => {
          console.error(`Database error: ${event.target.errorCode}`);
        };
      };

      request.onsuccess = (event: any) => {
        loadDb(event).then(() => {
          resolve();
        });
      };

      request.onupgradeneeded = (event: any) => {
        loadDb(event).then(() => {
          _generatorDB.createObjectStore("data", {
            autoIncrement: true
          });
        });
      };
    });
  }

  //#endregion
}

export default GeneratorDB;
