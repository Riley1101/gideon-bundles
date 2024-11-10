import { AssetGraph } from "./assetGraph.js";
import { AssetProcessor } from "./assetProcessor.js";
import { QueueSync } from "./QueueSync.js";
import { Resolver } from "./resolver.js";
import { appendFile, mkdirp, writeFile } from "./fsPromisified.js";
import chalk from "chalk";
import path from "path";
import * as register from "@babel/register";

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

  async packagesAssetIntoBundles() {
    await mkdirp("./dist", undefined);
    const topWrapper = `
      (function(modules) {
        function require(id) {
          if(!id){
            return ;
          }
          const [fn, mapping] = modules[id];

          function localRequire(name) {
            return require(mapping[name]);
          }

          const module = { exports : {} };

          fn(localRequire, module, module.exports);

          return module.exports;
        }

        require("${this.assetGraph.entryAsset.id}");
      })({`;

    await writeFile("dist/bundle.js", topWrapper, "utf8");

    for (let [filePath, asset] of this.assetGraph.graph) {
      if (filePath !== this.cwd) {
        let { id, depMapping } = asset;
        let p = await asset.getProcessed();
        if (p) {
          let moduleWrapper = `"${id}": [
          function (require, module, exports) {
            ${p.code.code}
          },
          ${JSON.stringify(depMapping)},
        ],`;

          await appendFile("dist/bundle.js", moduleWrapper);
        }
      }
    }

    await appendFile("dist/bundle.js", "})");
    console.log(chalk.green("Done Bundling!"));
  }

  async bundle() {
    await this.processAsset();
    await this.packagesAssetIntoBundles();
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
if (process.argv.length === 2) {
  console.error("Usage : scalable <entryPath>");
  process.exit(1);
}
const entryFile = process.argv[2];
let bundler = new Bundler(path.join(process.cwd(), entryFile));
bundler.bundle();
