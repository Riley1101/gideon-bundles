import PQueue from "pqueue";

export class QueueSync {
  /**
   * @param {PQueue[]} queues
   */
  constructor(queues) {
    this.queues = queues;
  }

  allDone() {
    return Promise.all(this.queues.map((que) => que.onIdle())).then(() => {
      const inProgress = this.queues.map((q) => q.size + q.pending);
      const anyUndone = inProgress.some((count) => count > 0);
      if (anyUndone) {
        return this.allDone();
      }
      console.log("All queues finished");
    });
  }
}
