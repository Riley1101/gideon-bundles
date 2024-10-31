import { createJobQueue } from "./resolver";

/**
 * @description Create a asset processor
 */
export function createAssetProsessor() {
  const queue = createJobQueue();

  return {
    queue,
    process: () => {},
  };
}

export function process() {}

export function processInWorkers() {}
