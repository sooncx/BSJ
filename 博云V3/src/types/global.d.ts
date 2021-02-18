declare interface Fn<T = any> {
  (...arg: T[]): T;
}

declare type Nullable<T> = T | null;
