import { fetchParser } from '@async-util/fetch';

(async function test() {
  let parser;

  console.log('==================== Fetch chuncks & cancel ==================== ')
  parser = await fetchParser('https://hello-sse.talrasha007.workers.dev/');
  await parser.cancel();
  for await (const chunk of parser.chuncks()) {
    // Should not print anything.
    console.log(chunk);
  }

  console.log('==================== Fetch chuncks ==================== ')
  parser = await fetchParser('https://hello-sse.talrasha007.workers.dev/');
  for await (const chunk of parser.chuncks()) {
    console.log(chunk);
  }

  console.log('==================== Fetch lines ==================== ')
  parser = await fetchParser('https://hello-sse.talrasha007.workers.dev/');
  for await (const line of parser.lines()) {
    console.log('line:', line);
  }

  console.log('==================== Fetch sse ==================== ')
  parser = await fetchParser('https://hello-sse.talrasha007.workers.dev/');
  for await (const event of parser.sse()) {
    console.log('event:', event);
  }

  console.log('==================== Fetch sse json ==================== ')
  parser = await fetchParser('https://hello-sse.talrasha007.workers.dev/');
  for await (const event of parser.sse(true)) {
    console.log('event:', event);
  }
})();
