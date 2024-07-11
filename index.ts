export interface SSEData<T> {
  data?: T;
  event?: string;
  id?: string;

  [index: string]: any;
}

class Parser {
  private _reader: ReadableStreamDefaultReader<Uint8Array>;
  
  constructor(readableStream: ReadableStream<Uint8Array>) {
    this._reader = readableStream.getReader();
  }

  cancel() {
    return this._reader.cancel();
  }

  async *chuncks() {
    while (true) {
      const { done, value } = await this._reader.read().catch(() => ({ done: true, value: undefined }));
      
      if (value) yield value;
      if (done) break;
    }
  }

  async *lines() {
    const decoder = new TextDecoder();

    let rest = '';
    for await (const chunk of this.chuncks()) {
      const text = rest + decoder.decode(chunk);
      const lines = text.split('\n');
      rest = lines.pop() || '';

      for (const line of lines) yield line;
    }

    if (rest) yield rest;
  }

  async *json<T = any>() {
    for await (const line of this.lines()) {
      if (line.trim()) yield JSON.parse(line) as T;
    }
  }

  async *sse<T = any>(isJsonData = false) {
    let current: SSEData<T> | null = null;
    for await (const line of this.lines()) {
      if (!line) {
        if (current) {
          yield current;
          current = null;
        }
        continue;
      }

      current = current || {};
      const match = /^(id|event|data): (.*)$/.exec(line);
      if (!match) {
        console.warn('Bad SSE line:', line);
        continue;
      }

      let [, key, value] = match;
      if (key === 'data' && isJsonData) {
        try { value = JSON.parse(value); }
        catch (e) { }
      }

      if (!current[key]) {
        current[key] = value;
      } else {
        yield current;
        current = { [key]: value };
      }
    }
  }
}

async function fetchParser(url: string | URL | globalThis.Request, opts?: RequestInit) {
  const resp = await fetch(url, opts);
  if (!resp.ok) throw new Error(`Fetch failed: ${resp.status} ${resp.statusText}`);

  return new Parser(resp.body!);
}

export default fetchParser;
export { Parser, fetchParser };