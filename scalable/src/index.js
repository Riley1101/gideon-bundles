import { insertOrNodeToGraph, createAssetGraph } from "./assetGraph.js";
import { createEmittery } from "./resolver.js";
import { createCache } from "./cache.js";

const emittery = createEmittery();
const cache = createCache();
const current_dir = process.cwd();

async function main() {
  const assetGraph = createAssetGraph();
  insertOrNodeToGraph(assetGraph, current_dir);
}

main();
