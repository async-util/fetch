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

  for await (const { data } of parser.sse(true)) {
    // console.log(data.choices?.[0] || data);
    const delta = data.choices?.[0].delta?.content;
    if (delta) process.stdout.write(delta);
  }
  console.log(''); // new line
})().catch(console.error);