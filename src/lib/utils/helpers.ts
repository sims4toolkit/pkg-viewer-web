/**
 * Separates text in PascalCase by spaces.
 * 
 * @param text Text to add spaces to
 */
export function addPascalSpaces(text: string): string {
  return text.replace(/([A-Z])/g, " $1").trim();
}

/**
 * Returns a function that can be used in `Array<T>.sort()` to sort `T` objects
 * by a string property named `prop`.
 * 
 * @param prop Property name to sort by
 */
export function compareProperty<T>(
  prop: FilteredKeys<T, string>[keyof T]
): (a: T, b: T) => number {
  return (a, b) => {
    if (a[prop] < b[prop]) return -1;
    if (a[prop] > b[prop]) return 1;
    return 0;
  };
}

/**
 * Adds an item to the correct array within a map. If no array exists, then one
 * is created.
 * 
 * @param map Map that maps keys to arrays
 * @param key Key of array to add to
 * @param value Value to append to array
 */
export function addToArrayMap<K, V>(map: Map<K, V[]>, key: K, value: V) {
  if (map.has(key)) map.get(key).push(value);
  else map.set(key, [value]);
}

/**
 * Returns a new array that contains the immediate children of all given arrays.
 * 
 * @param arrays List of lists to flatten
 */
export function flatten<T>(...arrays: readonly (readonly T[])[]): T[] {
  const combined: T[] = [];
  arrays.forEach(array => combined.push(...array));
  return combined;
}
