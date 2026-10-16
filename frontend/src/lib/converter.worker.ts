import { converterFactory } from "./bridge/orchestrator.mjs";
import { type FormatName, JPEG_QUALITY, WEBP_QUALITY } from "./fileManager";

type Bytes = Uint8Array<ArrayBuffer>;

export interface SuccessObj {
  ok: true;
  data: Bytes;
}
export interface FailObj {
  ok: false;
  error: string;
}
export type ReturnObj = SuccessObj | FailObj;

export interface WorkerRequest {
  inBytes: Bytes;
  inFormat: FormatName | undefined;
  outFormat: FormatName;
}
export type WorkerResponse = ReturnObj;

let converter: Awaited<ReturnType<typeof converterFactory>> | undefined;

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  let inBytes = event.data.inBytes;
  const inFormat = event.data.inFormat;
  const outFormat = event.data.outFormat;

  if (converter === undefined) converter = await converterFactory();

  let response: ReturnObj;

  try {
    // syncronous and very slow, but we're in a worker so who cares
    const outResult = await converter(
      outFormat.toLowerCase(),
      inBytes as any,
      WEBP_QUALITY,
    );
    response = {
      ok: true,
      data: outResult,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    response = {
      ok: false,
      error: msg,
    };
  }

  self.postMessage(response);
};
