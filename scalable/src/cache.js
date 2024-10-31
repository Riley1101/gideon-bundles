import { Level } from "level";
import path from "path";

/**
 * @typedef {Level<string, string>} Cache
 */

/**
 * @description Create a cache  for bundler
 */
export function createCache() {
  return new Level(path.join(process.cwd()), {
    valueEncoding: "utf8",
  });
}

/**
 * @param {Cache} cache Cache block
 * @param {string} k Cache key
 * @param {string} v Cache value
 * @returns {string}
 */
export function addAssetToCache(cache, k, v) {
  cache.put(k, v);
  return k;
}
