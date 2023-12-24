import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: "PUT API KEY HERE",
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "Can you write a 50 word essay on why Linux is better than Windows and Mac?" }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

main();