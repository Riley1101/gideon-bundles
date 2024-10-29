import {
  generateAssetId,
  createAssetGraph,
  createAssetNode,
} from "./assetGraph.js";

const current_dir = process.cwd();

async function main() {
  const depGraph = createAssetGraph(current_dir);
  const entryNode = createAssetNode(current_dir);
  console.log(depGraph);
}

main();
