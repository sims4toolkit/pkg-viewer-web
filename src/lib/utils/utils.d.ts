type FilteredKeys<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
};