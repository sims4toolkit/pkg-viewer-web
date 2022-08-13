import type { StoredGeneratorData } from "../components/pages/generator/types";

// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

let generatorDB: IDBDatabase;

async function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("PackageGeneratorDB", 1);

    request.onerror = () => {
      alert("Your browser does not support indexed databases, which means your work in the package generator will not be saved. Make sure you do not navigate away from this page, or you will lose your progress.");
    };

    const loadDb = async (event: any) => {
      generatorDB = event.target.result;
      generatorDB.onerror = (event: any) => {
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
        generatorDB.createObjectStore("data", {
          autoIncrement: true
        });
      });
    };
  });
}

export async function fetchGeneratorData(): Promise<StoredGeneratorData> {
  return new Promise((resolve, reject) => {
    const getData = () => {
      const request = generatorDB
        .transaction("data", "readonly")
        .objectStore("data")
        .get(0);

      request.onerror = () => {
        reject("Could not fetch data.");
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    }

    if (generatorDB === undefined) {
      initializeDatabase().then(getData)
    } else {
      getData();
    }
  });
}

export async function saveGeneratorData(data: StoredGeneratorData) {
  const saveToDB = () => generatorDB
    .transaction("data", "readwrite")
    .objectStore("data")
    .put(data, 0);

  if (generatorDB === undefined) {
    initializeDatabase().then(saveToDB)
  } else {
    saveToDB();
  }
}
