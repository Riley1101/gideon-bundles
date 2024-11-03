import { createCache } from "./cache.js";

const cache = createCache();

export class AssetNode {
  /**
   * @param {string} filePath
   */
  constructor(filePath) {
    this.id = AssetNode.generateId(filePath);
    this.filePath = filePath;
    this.depMapping = {};
  }

  /**
   * @static
   * @param {string} filePath
   * @returns {string}
   */
  static generateId(filePath) {
    let regex = new RegExp(`^${process.cwd()}`);
    return filePath.replace(regex, "");
  }

  getProcessed() {
    return cache.get(`processed:${this.filePath}`).then(
      (processd) => {
        return JSON.parse(processd);
      },
      (err) => {
        if (err.notFound) {
          return null;
        }
        throw err;
      },
    );
  }

  setProcessed(processed) {
    return cache.put(`processed:${this.filePath}`, JSON.stringify(processed));
  }
}

export class AssetGraph {
  /**
   * @param { string } entryPath
   */
  constructor(entryPath) {
    this.graph = new Map();
    this.entryAsset = new AssetNode(entryPath);
    this.graph.set(entryPath, this.entryAsset);
  }

  /**
   * @param {string} filePath
   * @returns {AssetNode}
   */
  get(filePath) {
    let asset = this.graph.get(filePath);
    if (!asset) {
      asset = new AssetNode(filePath);
      this.graph.set(filePath, asset);
    }
    return asset;
  }

  /**
   * @param {import("./resolver.js").ModuleRequest} moduleRequest
   */
  addRelationship(moduleRequest) {
    const { sourcePath, resolvedPath, moduleId } = moduleRequest;
    const asset = this.get(sourcePath);
    const depAsset = this.get(resolvedPath);
    asset.depMapping[moduleId] = depAsset.id;
  }
}
