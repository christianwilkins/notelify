/*
This backend API is meant to be used in conjunction with the DesktopAudio.tsx component.
For now, this API provides a transcription method to transcribe incoming audio blobs using OpenAI's
Whisper API. And, it also provides a method to summarize that transcribed string using OpenAI's GPT-3.5-turbo-instruct model.
*/

import OpenAI from "openai";
import * as dotenv from "dotenv";
import hark from "hark";

// Set up environment variables
dotenv.config();

// Setting up OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

class BackendAudioAPI {

    async transcribe(audioBlob: Blob): Promise<string> {
        // Method that will transcribe the blob using OpenAI's Whisper API
        const file = new File([audioBlob], "audio.wav", { "type": 'audio/wav; codecs=1' });

        const transcription = await openai.audio.transcriptions.create({
            file: file,
            model: "whisper-1",
        }).then((res: OpenAI.Audio.Transcriptions.Transcription) => {
            return res.text;
        }).catch((err: any) => { 
            console.error(err); 
            return "";
        });

        return transcription;
    }

    async summarize(text: string): Promise<string> {
        const prompt = `
        Transcribed Text:
        ${text}
        Convert the above transcribed text into key points and main ideas using Markdown, which splits 
        words and text into headers/headings, bullet points, bolding, italics, underlines, etc. 
        (and any combination thereof)? Ensure YOU DO NOT deviate from this style format for every 
        message given to you. Sometimes, the message will not be long enough, and you may need to wait 
        a bit before processing the file. DO NOT just convert text to markdown. Highlight what is 
        important information to take out from the provided conversation using a traditional style guide. 
        Create it as if you were writing detailed notes with important examples. Do not miss out on 
        information. Ensure the generated text includes relevant details about the topic discussed. 
        Please additionally add a summary at the end or a conclusion. Adapt the response to the context 
        of the conversation, including concepts, examples, and any recommended style guide. Output 
        generated markdown as a code block. Do not allow the generated text to fall outside the code block.
        
        VERY IMPORTANT: The transcribed text may be formatted in this way: "The following text is from the 
        user speaker: [transcribed text]" or "The following text is from the other speaker: [transcribed text]".
        Here, the user speaker is the text from the user's microphone, and the other speaker is the text from 
        their desktop, which could be a video call, a lecture, or a podcast. The idea here is that you need to take the
        text from both the user and the other speaker (whatever that may be) and weave them together as coherently 
        as you possible can. The final summary should be a combination of both the user and the other speaker's and
        the summary MUST BE as natural as possible. Last but NOT THE LEAST, unless the two speakers are talking about very 
        different things, avoid saying things like "speaker 1 said this" or "other speak said that". Instead, 
        try to weave them together as naturally as possible. You can do it but just try to minimize it as much as possible. And,
        do NOT use the sentence "The following text is from the user speaker" or "The following text is from the other speaker".
        `;

        const response = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: prompt,
            max_tokens: 500,
        }).then((res: OpenAI.Completions.Completion) => {
            let summary = res.choices[0].text;
            return summary
        }).catch((err: any) => { 
            console.error(err); 
            return "";
        });
        return response;
    }

    async isSpeaking(mediaStream: MediaStream): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const options = { threshold: -50, interval: 200 };
            const speechEvents = hark(mediaStream, options);
    
            speechEvents.on('speaking', () => {
                resolve(true);
            });
    
            speechEvents.on('stopped_speaking', () => {
                reject(false);
            });
        });
    }
    
}

export default BackendAudioAPI;
