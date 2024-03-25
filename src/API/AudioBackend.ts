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

// THE JSON OUTPUT FILE MUST BE FORMATTED THE FOLLOWING WAY. IT MUST HAVE THE OPENING AND CLOSING BRACKETS:
// Please DO NOT write anything in your reply outside of this JSON. Here is the format:

// {
//     "userid": "The user ID of the person who requested the summary",
//     "title": "The title of the conversation",
//     "content": "The summary of the conversation in markdown format",
//     "transcribed_text": "The transcribed text of the conversation",
// }


const prompt = `Imagine you are a student in a classroom, and you are taking notes on a lecture. Because you are
a taking notes live, you need to be able to quickly and efficiently summarize the main points of the
lecture. You also do not know the future of what is going to be said so you need to be able to identify
the most important points as they come. This is a very important skill to have.
    
You should also be able to tell when the speaker is talking about a new topic or a new idea.
to best organize your notes you should organzie them by topic and subtopics.

You will be given pieces of the transcribed lecture/conversation and you need to find the noteworthy points as they come in.

As a professional note-taker, you need to be able to quickly and efficiently summarize the main points of a conversation. However, you
also will need to format the response correctly. 


Convert transcribed text into key points and main ideas using Markdown, which splits 
words and text into headers/headings, bullet points, bolding, italics, underlines, etc. 
(and any combination thereof)? Ensure YOU DO NOT deviate from this style format for every 
message given to you. Sometimes, the message will not be long enough, and you may need to wait 
a bit before processing the file. DO NOT just convert text to markdown. Highlight what is 
important information to take out from the provided conversation using a traditional style guide. 
Create it as if you were writing detailed notes with important examples. Do not miss out on 
information. Ensure the generated text includes relevant details about the topic discussed. 
Please additionally add a summary at the end or a conclusion. Adapt the response to the context 
of the conversation, including concepts, examples, and any recommended style guide. The output should be inside the markdown_summary key.

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

class BackendAudioAPI {
    assistant_id: any;

    async initAssistant(): Promise<void> {
        // Method that will initialize the GPT Assistant
        const assistantResponse = await openai.beta.assistants.create({
            name: "Professional Notetaker",
            instructions: prompt,
            model: "gpt-3.5-turbo-0125",
            tools: [{
                "type": "function",
                "function": {    
                    "name": "response",
                    "description": "Note-taking with title and markdown summary",
                    "parameters": {
                        "type": "object",
                        "required": [
                            "userid",
                            "title",
                            "content",
                            "transcribed_text",
                        ],    
                        "properties": {
                            "userid": {
                                "type": "string",
                                "description": "The user ID of the person who requested the summary"
                            },
                            "title": {
                                "type": "string",
                                "description": "The title of the conversation"
                            },
                            "content": {
                                "type": "string",
                                "description": "The summary of the conversation in markdown format"
                            },
                        },
                    }
                }
            }]
        });
        this.assistant_id = assistantResponse.id;
    }

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
    
    async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async summarize(text: string, props: any): Promise<string> {
        console.log(`Transcribed Text: ${text}`);
        let markdownSummary = "";


        try {
            

            // Create a thread.
            const thread = await openai.beta.threads.create();
            const threadId = thread.id;

            // Create a message.
            await openai.beta.threads.messages.create(threadId, {
                role: "user",
                content: `${text}`,
            });
            // console.log("Message created>>>>>>", `Summarize the following text in markdown format:\n\n${text}`);
            // await openai.beta.threads.messages.create(threadId, {
            //     role: "user",
            //     content: "Get a title of the text in markdown format:\n\n${text}",
            // });

            // Run the assistant.
            const run = await openai.beta.threads.runs.createAndStream(threadId, {
                assistant_id: this.assistant_id,
            }).on('textCreated', async (text) => {
                try {
                    await this.delay(1000);
                    console.dir(text, { depth: null })
                    props.editorRef.current?.setContent(text);
                    const data = JSON.parse(text.value);
                    const textToAppend = data.markdown_summary;
                    
                    props.editorRef.current?.setContent(textToAppend);
                } catch (error) {
                    console.error('Error processing the text:', error);
                }
            });
        // }).on('toolCallDelta', (toolCallDelta, snapshot) => {
        //     if (toolCallDelta.type === 'code_interpreter') {
        //         if (toolCallDelta.code_interpreter.input) {
        //         process.stdout.write(toolCallDelta.code_interpreter.input);
        //         }
        //         if (toolCallDelta.code_interpreter.outputs) {
        //         process.stdout.write("\noutput >\n");
        //         toolCallDelta.code_interpreter.outputs.forEach(output => {
        //             if (output.type === "logs") {
        //             process.stdout.write(`\n${output.logs}\n`);
        //             }
        //         });
        //         }
        //     }
        // });

                        
            console.log(run);
            // markdownSummary = run.choices[0].text.trim();
            // markdownSummary = response.choices[0].text.trim();
        } catch (err) {
            console.error(err);
        }
        
        // return JSON.stringify({
        //     // title_text: title,
        //     transcribed_text: text,
        //     markdown_summary: markdownSummary,
        //     new_content_index: newContentIndex
        // });
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
