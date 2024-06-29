
export interface Parser {
  constructor(readableStream: ReadableStream<Uint8Array>);
  cancel(): Promise<void>;
  chuncks(): AsyncIterableIterator<Uint8Array>;
  lines(): AsyncIterableIterator<String>;
  json(): AsyncIterableIterator<Object>;
  sse<T=Object>(isJsonData: Boolean): AsyncIterableIterator<T>;
}

export function fetchParser(url: RequestInfo | URL | String, opts?: RequestInit | undefined): Promise<Parser>;

export default fetchParser;