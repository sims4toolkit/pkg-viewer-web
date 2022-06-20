import type { Package } from "@s4tk/models";
import { Writable, writable } from "svelte/store";
import { Settings } from "./storage";

function createSettingStore<T>(name: string): Writable<T> {
  const store = writable(Settings[name]);

  store.subscribe(value => {
    Settings[name] = value;
  });

  return store;
}

export const isLightThemeStore = createSettingStore<boolean>("isLightTheme");
