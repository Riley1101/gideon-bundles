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
export function insertOrNodeToGraph(graph, sourcePath) {
  let asset = graph.get(sourcePath);
  if (!!asset) {
    return asset;
  } else {
    asset = createAssetNode(sourcePath);
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
 * @returns void;
 */
export function addRelationBetweenNodes(
  graph,
  moduleId,
  sourcePath,
  resolvedPath,
) {
  const sourceAsset =
    graph.get(sourcePath) || insertOrNodeToGraph(graph, sourcePath);
  const resolvedAsset =
    graph.get(resolvedPath) || insertOrNodeToGraph(graph, resolvedPath);
  sourceAsset.depMapping[moduleId] = resolvedAsset.id;
}
