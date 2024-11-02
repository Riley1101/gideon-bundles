import { AssetGraph } from "./assetGraph.js";
import { AssetProcessor } from "./assetProcessor.js";
import { QueueSync } from "./QueueSync.js";
import { Resolver } from "./resolver.js";

/** @typedef {import("./resolver.js").ModuleRequest} ModuleRequest */
export default class Bundler {
  /**
   * @param {string} entryRequest entry file
   */
  constructor(entryRequest) {
    this.entryRequest = entryRequest;
    this.cwd = process.cwd();
    this.assetGraph = new AssetGraph(entryRequest);
    this.resolver = new Resolver();
    this.assetProsessor = new AssetProcessor();

    console.log(this.assetGraph);

    this.resolver.on(
      "resolved",
      (/** @type {ModuleRequest} moduleRequest */ moduleRequest) => {
        let { resolvedPath } = moduleRequest;
        this.assetGraph.addRelationship(moduleRequest);
        let asset = this.assetGraph.get(resolvedPath);
        this.assetProsessor.process(asset);
      },
    );

    this.assetProsessor.on(
      "foundDepRequest",
      (/** @type {ModuleRequest} moduleRequest */ moduleRequest) => {
        this.resolver.resolve(moduleRequest);
      },
    );

    this.queueSync = new QueueSync([
      this.resolver.queue,
      this.assetProsessor.queue,
    ]);
  }
}

new Bundler("./test/index.js");
