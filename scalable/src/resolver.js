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

export function createJobQueue() {
  return new PQueue({ concurrency: 8 });
}

/**
 * @returns {{ emitter:Emittery ,resolve: (callback:any)=>void , resolveInWorkers : ()=> void }}
 */
export function createResolver() {
  const emitter = createEmittery();
  const queue = createJobQueue();

  return {
    emitter,
    resolve: async (callback) => {
      queue.add(callback);
    },
    resolveInWorkers: async () => {},
  };
}
