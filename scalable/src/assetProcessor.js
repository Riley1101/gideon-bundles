import Emittery from "emittery";
import PQueue from "p-queue";
import path from "path";
import { AssetNode } from "./assetGraph.js";
import { fork } from "child_process";

export class AssetProcessor extends Emittery {
  constructor() {
    super();
    this.queue = new PQueue();
  }

  /**
   * @param {AssetNode} asset;
   */
  process(asset) {
    console.log(`Processing ${asset.filePath}`);
    return this.queue.add(() => this.processInWorker(asset));
  }

  /**
   * @param {AssetNode} asset;
   */
  processInWorker(asset) {
    let { filePath } = asset;
    return new Promise((resolve, reject) => {
      let worker = fork(path.join(__dirname, "processInWorker.js"));
      worker.on("message", async (msg) => {
        let { eventName, ...rest } = msg;
        if (eventName === "finished") {
          worker.kill("SIGINT");
          let { data } = rest;
          await asset.setProcessed(data);
          resolve(data);
        } else {
          this.emit(eventName, rest);
        }
      });
      worker.on("error", (_error) => {
        reject(new Error("Failed to process asset" + filePath));
      });
      worker.send(filePath);
    });
  }
}
