import {
  addNodeToGraph,
  addRelationBetweenNodes,
  createAssetGraph,
  createAssetNode,
} from "./assetGraph.js";

const current_dir = process.cwd();

async function main() {
  const assetGraph = createAssetGraph();
  addNodeToGraph(assetGraph, current_dir);
  console.log(assetGraph);
}

main();
