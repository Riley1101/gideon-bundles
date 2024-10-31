import { createEmittery, createJobQueue } from "./resolver";
import rootPath from "path";
import { fork } from "child_process";

export function createAssetProsessor() {
  const queue = createJobQueue();
  const emitter = createEmittery();

  /**
   * @param {import("./assetGraph").AssetNode} asset
   */
  function processInWorkers(asset) {
    let { path } = asset;
    return new Promise((resol, reject) => {
      let worker = fork(rootPath.join(__dirname, "processAssetWorker.js"));
      worker.on("message", async (msg) => {
        let { eventName, ...res } = msg;
        if (eventName === "finished") {
          worker.kill("SIGINT");
          let { data } = res;
          await asset.setProcessed(data);
        } else {
          emitter.emit(eventName, rest);
        }
      });
      worker.on("error", () => {
        reject(new Error("Failed to process file" + path));
      });
      worker.send(path);
    });
  }

  return {
    queue,
    process: (asset) => {
      queue.add(() => processInWorkers(asset));
    },
  };
}
