import { OpenAI } from "openai";

const openaiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openaiKey,
  /* apiKey: "", */
  dangerouslyAllowBrowser: true, // lmao
});