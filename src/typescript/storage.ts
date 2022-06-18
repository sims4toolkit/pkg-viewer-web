import type { UserSettings } from "../global";
import { toggleLightTheme } from "./doc-attrs";

//#region Key Generators

const settingKey = (uuid: string) => "s:" + uuid;

//#endregion Key Generators

//#region Types

interface StoredSetting<T> {
  get: (setting: string, defaultValue?: T) => T;
  set: (setting: string, value: T) => void;
}

function StoredString(): StoredSetting<string> {
  return {
    get(prop: string, defaultValue: string = "") {
      return localStorage.getItem(settingKey(prop)) ?? defaultValue;
    },
    set(prop: string, value: string) {
      localStorage.setItem(settingKey(prop), value);
    }
  }
};

function StoredBoolean(uiUpdateFn?: (value: boolean) => void): StoredSetting<boolean> {
  return {
    get(prop: string, defaultValue: boolean = false) {
      const value = localStorage.getItem(settingKey(prop));
      return value ? value === "true" : defaultValue;
    },
    set(prop: string, value: boolean) {
      localStorage.setItem(settingKey(prop), value ? "true" : "false");
      uiUpdateFn?.(value);
    }
  }
};

function StoredInteger(): StoredSetting<number> {
  return {
    get(prop: string, defaultValue: number = 0) {
      const value = localStorage.getItem(settingKey(prop));
      return value ? parseInt(value) : defaultValue;
    },
    set(prop: string, value: number) {
      localStorage.setItem(settingKey(prop), value.toString());
    }
  }
};

function StoredStringList(): StoredSetting<string[]> {
  return {
    get(prop: string, defaultValue: string[] = []) {
      const value = localStorage.getItem(settingKey(prop));
      return value ? JSON.parse(value) as string[] : defaultValue;
    },
    set(prop: string, value: string[]) {
      localStorage.setItem(settingKey(prop), JSON.stringify(value));
    }
  }
};

//#endregion Types

function getSettingsProxy(settings: object): UserSettings {
  return new Proxy(settings, {
    get(target, prop) {
      return target[prop].get(prop);
    },
    set(target, prop, value) {
      target[prop].set(prop, value);
      return true;
    }
  }) as unknown as UserSettings;
}

/**
 * Interface for all user settings and single values.
 */
export const Settings = getSettingsProxy({
  isLightTheme: StoredBoolean(toggleLightTheme),
});
