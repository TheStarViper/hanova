import type { WorkerRequest, WorkerResponse } from "./converter.worker";

export class CppManager {
  #worker: Worker | null = null;
  response: WorkerResponse | null = null;

  hooks: ((response: WorkerResponse) => void)[] = [];

  constructor() {}

  async init() {
    this.#worker = new Worker(
      new URL("./converter.worker.ts", import.meta.url),
      { type: "module" },
    );

    this.#worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      this.response = event.data;

      for (const hook of this.hooks) {
        hook(this.response);
      }
    };
  }

  startConversion(request: WorkerRequest) {
    if (this.#worker === null) throw new Error("call worker init first");

    this.#worker.postMessage(request);
  }
}
