import { OpenAI } from "openai";
import { createRequire } from "module";
import * as dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main(userInput) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: userInput }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

const require = createRequire(import.meta.url);

const prompt = require('prompt-sync')({sigint: true});
const userInput = prompt('Enter your message: ');

main(userInput);

