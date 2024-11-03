import Emittery from "emittery";
import PQueue from "p-queue";
import path from "path";
import { fork } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @typedef {{moduleId:string, sourcePath: string, resolvedPath?: string}} ModuleRequest
 */

export class Resolver extends Emittery {
  constructor() {
    super();
    this.queue = new PQueue({ concurrency: 9 });
  }

  /**
   * @param {ModuleRequest} moduleRequest
   */
  async resolve(moduleRequest) {
    console.log(`Resolving ${moduleRequest.moduleId}`);
    this.queue.add(() => this.resolveInWorker(moduleRequest));
  }

  /**
   * @param {ModuleRequest} moduleRequest
   */
  resolveInWorker(moduleRequest) {
    return new Promise((resolve, reject) => {
      let worker = fork(path.join(__dirname, "resolveWorker.js"));
      worker.on("message", (msg) => {
        this.emit("resolved", msg);
        resolve(msg);
        worker.kill("SIGINT");
      });
      worker.on("error", (err) => {
        reject(err);
      });
      worker.send(moduleRequest);
    });
  }
}
