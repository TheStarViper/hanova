import { converterFactory, type Format, initMagick } from "./backend";

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
  outFormat: Format;
  quality: number;
}
export type WorkerResponse = ReturnObj;

let converter: Awaited<ReturnType<typeof converterFactory>> | undefined;

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  let inBytes = event.data.inBytes;
  const outFormat = event.data.outFormat;
  const quality = event.data.quality;

  if (converter === undefined) {
    await initMagick();
    converter = await converterFactory();
  }

  let response: ReturnObj;

  try {
    // syncronous and very slow, but we're in a worker so who cares
    const outResult = await converter.convert(
      inBytes as any,
      outFormat.toLowerCase(),
      { quality },
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
