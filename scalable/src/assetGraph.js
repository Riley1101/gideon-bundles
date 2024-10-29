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
 */
export function createAssetGraph() {
  const map = new Map();
  return map;
}

/**
 * @description Add a Node to graph
 * @param {AssetGraph} graph
 * @param {string} sourcePath source Path
 * @returns {AssetNode}
 */
export function addNodeToGraph(graph, sourcePath) {
  const asset = createAssetNode(sourcePath);
  if (!graph.has(sourcePath)) {
    graph.set(sourcePath, asset);
  }
  return asset;
}

/**
 * @description add relation ship between nodes
 * @param {AssetGraph} graph Graph to be added
 * @param {string} moduleId Module Id
 * @param {string} sourcePath Entry path
 * @param {string} resolvedPath Entry path
 * @returns {AssetNode} Created asset Node
 */
export function addRelationBetweenNodes(
  graph,
  moduleId,
  sourcePath,
  resolvedPath,
) {
  const sourceAsset = graph.get(sourcePath) || createAssetNode(sourcePath);
  if (!graph.has(sourcePath)) {
    graph.set(sourcePath, sourceAsset);
  }
  const resolvedAsset =
    graph.get(resolvedPath) || createAssetNode(resolvedPath);
  if (!graph.has(resolvedPath)) {
    graph.set(resolvedPath, resolvedAsset);
  }
  sourceAsset.depMapping[moduleId] = resolvedAsset.id;
  return sourceAsset;
}
