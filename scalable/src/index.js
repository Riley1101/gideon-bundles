import { AssetGraph } from "./assetGraph.js";
import { Resolver } from "./resolver.js";

export default class Bundler {
  /**
   * @param {string} entryRequest entry file
   */
  constructor(entryRequest) {
    this.entryRequest = entryRequest;
    this.cwd = process.cwd();
    this.assetGraph = new AssetGraph(entryRequest);
    this.resolver = new Resolver();
  }
}
