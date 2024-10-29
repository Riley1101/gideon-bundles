import { insertOrNodeToGraph, createAssetGraph } from "./assetGraph.js";

const current_dir = process.cwd();

async function main() {
  const assetGraph = createAssetGraph();
  insertOrNodeToGraph(assetGraph, current_dir);
  console.log(assetGraph);
}

main();
