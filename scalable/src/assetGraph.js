/**
 * @typedef {Map<string,AssetNode>} AssetGraph
 * @typedef {{id: string, path: string,depMapping:Record<string, string>}} AssetNode
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

/**
 * @description add a node to graph
 * @param {AssetGraph} graph Graph to be added
 * @param {string} moduleId Module Id
 * @param {string} sourcePath Entry path
 * @param {string} resolvedPath Entry path
 * @returns {AssetNode} Created asset Node
 */
export function addNodeToGraph(graph, moduleId, sourcePath, resolvedPath) {
  const sourceAsset = graph.get(sourcePath) || createAssetNode(sourcePath);
  const resolvedAsset =
    graph.get(resolvedPath) || createAssetNode(resolvedPath);
  sourceAsset.depMapping[moduleId] = resolvedAsset.id;
  return sourceAsset;
}
