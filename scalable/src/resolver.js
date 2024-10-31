import Emittery from "emittery";
import PQueue from "pqueue";
import path from "path";
import { fork } from "child_process";

/**
 * @description An emittery for making events async
 */
export function createEmittery() {
  return new Emittery();
}

/**
 * @returns {PQueue}
 */
export function createJobQueue() {
  return new PQueue({ concurrency: 8 });
}

/**
 * @returns {{emitter:Emittery ,resolve: (callback:any)=>PromiseLike<string> , resolveInWorkers : ()=> PromiseLike<string>}}
 */
export function createResolver() {
  const emitter = createEmittery();
  const queue = createJobQueue();

  return {
    emitter,
    resolve: async (callback) => {
      return queue.add(callback);
    },
    resolveInWorkers: async () => {
      return new Promise((resol, reject) => {
        let worker = fork(path.join(__dirname, "resolveWorker.js"));
        worker.on("message", (msg) => {
          emitter.emit("resolve", msg);
          resol("msg");
          worker.kill("SIGINT");
        });

        worker.on("error", (err) => {
          reject(err);
        });
      });
    },
  };
}
