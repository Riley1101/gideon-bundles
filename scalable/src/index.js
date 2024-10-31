import { insertOrNodeToGraph, createAssetGraph } from "./assetGraph.js";
import { createResolver } from "./resolver.js";
import { createCache } from "./cache.js";

const cache = createCache();
const current_dir = process.cwd();

async function main() {
  const assetGraph = createAssetGraph();
  const { emitter, resolve, resolveInWorkers } = createResolver();
  insertOrNodeToGraph(assetGraph, current_dir);

  emitter.on("resolved", (moduleRequest) => {
    console.log(moduleRequest);
  });
}

main();
