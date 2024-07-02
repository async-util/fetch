export interface SSEData<T> {
  data?: T;
  event?: string;
  id?: string;
}

export interface Parser {
  constructor(readableStream: ReadableStream<Uint8Array>);
  cancel(): Promise<void>;
  chuncks(): AsyncIterableIterator<Uint8Array>;
  lines(): AsyncIterableIterator<string>;
  json<T=any>(): AsyncIterableIterator<T>;
  sse<T=any>(isJsonData: Boolean): AsyncIterableIterator<SSEData<T>>;
}

export function fetchParser(url: RequestInfo | URL | String, opts?: RequestInit | undefined): Promise<Parser>;

export default fetchParser;