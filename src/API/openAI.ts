import OpenAI from "openai";

const openaiKey = process.env.REACT_APP_OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: "key",
  /* apiKey: "", */
  dangerouslyAllowBrowser: true, // lmao
});

