/**
 * @typedef {Map<string,any>} AssetGraph
 * @typedef {{id: string, path: string,depMapping:Record<string, any>}} AssetNode
 */

/**
 * @description generate an Asset Id while replacing current path
 * @param {string} path  asset entry path
 */
export function generateAssetId(path) {
  let regex = new RegExp(`^${process.cwd()}`);
  return path.replace(regex, "");
}

/**
 * @param {string} filePath Asset node path
 * @returns {AssetNode}
 */
export function createAssetNode(filePath) {
  return {
    id: generateAssetId(filePath),
    path: filePath,
    depMapping: {},
  };
}

/**
 * @description generating a new asset Graph
 * @param {string} entryPath  asset entry path
 */
export function createAssetGraph(entryPath) {
  const map = new Map();
  return map;
}
