import { AssetGraph } from "./assetGraph.js";
import { AssetProcessor } from "./assetProcessor.js";
import { QueueSync } from "./QueueSync.js";
import { Resolver } from "./resolver.js";
import chalk from "chalk";

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
        if (resolvedPath) {
          let asset = this.assetGraph.get(resolvedPath);
          this.assetProsessor.process(asset);
        } else {
          console.log(
            chalk.red("resolvedPath missing for " + moduleRequest.moduleId),
          );
        }
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

  async bundle() {
    await this.processAsset();
  }

  async processAsset() {
    this.resolver.resolve({
      sourcePath: this.cwd,
      moduleId: this.entryRequest,
    });
    await this.queueSync.allDone();
    console.log(chalk.green("Done Processing !"));
  }
}

let bundler = new Bundler("./test/index.js");
bundler.bundle();
