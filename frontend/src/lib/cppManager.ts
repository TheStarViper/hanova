import type { WorkerResponse, WorkerRequest } from "./cppRunner.worker";

export class CppManager {
	private worker: Worker | null = null;
	response: WorkerResponse | null = null;

	hook: ((response: WorkerResponse) => void) | null = null;

	constructor() {}

	async init() {
		this.worker = new Worker(
			new URL("./cppRunner.worker.ts", import.meta.url),
			{ type: "module" },
		);

		this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
			this.response = event.data;

			this.hook?.(this.response);
		};
	}

	startConversion(request: WorkerRequest) {
		if (this.worker === null) throw new Error("call worker init first");

		this.worker.postMessage(request);
	}
}
