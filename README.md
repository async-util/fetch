# @async-util/fetch
A super lightweight lib for parsing ReadableStream which is the type of Response.body of *fetch api*, implement by async generator fuction, so we can write code in AsyncIterableIterator style.

## Parser & fetchParser
The parser ctor accepts a ReadableStream.
```js
import { Parser } from '@async-util/fetch';

async function foo() {
  const resp = await fetch('https://your/stream/url', opts);
  const parser = new Parser(resp.body);
}
```

If you are parsing data from fetch response, use fetchParser, the arg is exactly the same as *fetch*.
```js
imoport fetchParser from '@async-util/fetch';
// or
imoport { fetchParser } from '@async-util/fetch';

async function foo() {
  const parser = await fetchParser('https://your/stream/url', opts);
}
```

## Read data from stream
Here's a exmaple of read the data of *OPENAI* chat completions api with stream = true.
```js
import fetchParser from '@async-util/fetch';

const openAiKey = process.env.OPENAI_KEY;

(async function () {
  const parser = await fetchParser('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openAiKey}`
    },
    body: JSON.stringify({
      stream: true,
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, how are you?' }
      ]
    })
  });

  for await (const { data } of parser.sse(true /* event.data is json, except the last one '[DONE]' */)) {
    console.log(data.choices?.[0] || data);
  }
})().catch(console.error);
```
Results looks like:
```
{
  index: 0,
  delta: { role: 'assistant', content: '' },
  finish_reason: null
}
{ index: 0, delta: { content: 'Hello' }, finish_reason: null }
{ index: 0, delta: { content: '!' }, finish_reason: null }
{ index: 0, delta: { content: ' I' }, finish_reason: null }
{ index: 0, delta: { content: "'m" }, finish_reason: null }
{ index: 0, delta: { content: ' an' }, finish_reason: null }
{ index: 0, delta: { content: ' AI' }, finish_reason: null }
{ index: 0, delta: { content: ' assistant' }, finish_reason: null }
{ index: 0, delta: { content: ',' }, finish_reason: null }
{ index: 0, delta: { content: ' so' }, finish_reason: null }
{ index: 0, delta: { content: ' I' }, finish_reason: null }
{ index: 0, delta: { content: ' don' }, finish_reason: null }
{ index: 0, delta: { content: "'t" }, finish_reason: null }
{ index: 0, delta: { content: ' have' }, finish_reason: null }
{ index: 0, delta: { content: ' feelings' }, finish_reason: null }
{ index: 0, delta: { content: ',' }, finish_reason: null }
{ index: 0, delta: { content: ' but' }, finish_reason: null }
{ index: 0, delta: { content: ' I' }, finish_reason: null }
{ index: 0, delta: { content: "'m" }, finish_reason: null }
{ index: 0, delta: { content: ' here' }, finish_reason: null }
{ index: 0, delta: { content: ' to' }, finish_reason: null }
{ index: 0, delta: { content: ' help' }, finish_reason: null }
{ index: 0, delta: { content: ' you' }, finish_reason: null }
{ index: 0, delta: { content: '.' }, finish_reason: null }
{ index: 0, delta: { content: ' How' }, finish_reason: null }
{ index: 0, delta: { content: ' can' }, finish_reason: null }
{ index: 0, delta: { content: ' I' }, finish_reason: null }
{ index: 0, delta: { content: ' assist' }, finish_reason: null }
{ index: 0, delta: { content: ' you' }, finish_reason: null }
{ index: 0, delta: { content: ' today' }, finish_reason: null }
{ index: 0, delta: { content: '?' }, finish_reason: null }
{ index: 0, delta: {}, finish_reason: 'stop' }
[DONE]
```

Or write data to stdout, you will feel it is typing the response.
```js
  for await (const { data } of parser.sse(true)) {
    const delta = data.choices?.[0].delta?.content;
    if (delta) process.stdout.write(delta);
  }
```

### sse
If the data source is [Server Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
```js
async function foo() {
  const parser = await fetchParser('https://your/stream/url', opts);
  for await (const evt of paser.sse(true /* if the data of event is json format. */)) {
    console.log(evt.event, evt.id, evt.data);
  }
}
```

#### lines
```js
async function foo() {
  const parser = await fetchParser('https://your/stream/url', opts);
  for await (const line of paser.lines()) {
    console.log(line);
  }
}
```

#### json data
If every non-empty line is valid json:
```js
async function foo() {
  const parser = await fetchParser('https://your/stream/url', opts);
  for await (const j of paser.json()) {
    console.log(j);
  }
}
```

#### chunks
```js
async function foo() {
  const parser = await fetchParser('https://your/stream/url', opts);
  for await (const chunk of paser.chunks()) {
    console.log(chunk);
  }
}
```