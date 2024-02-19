import { OpenAI } from "openai";

const openaiKey = process.env.REACT_APP_OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: "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",
  /* apiKey: "", */
  dangerouslyAllowBrowser: true, // lmao
});