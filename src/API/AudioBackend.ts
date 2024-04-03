/*
This backend API is meant to be used in conjunction with the DesktopAudio.tsx component.
For now, this API provides a transcription method to transcribe incoming audio blobs using OpenAI's
Whisper API. And, it also provides a method to summarize that transcribed string using OpenAI's GPT-3.5-turbo-instruct model.
*/

import OpenAI from "openai";
import * as dotenv from "dotenv";
import hark from "hark";
import { ReadableStream } from 'web-streams-polyfill/ponyfill/es2018';
import { EventEmitter } from 'events';
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { response } from "express";
import { json } from "stream/consumers";
import { startupSnapshot } from "v8";

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
to best organize your notes you should organize them by topic and subtopics.

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
of the conversation, including concepts, examples, and any recommended style guide. PLACE THIS OUTPUT IN THE content key.

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

let previousText = "";

class BackendAudioAPI {
    assistant_id: any;

    async initAssistant(): Promise<void> {
        // Method that will initialize the GPT Assistant
        const assistantResponse = await openai.beta.assistants.create({
            name: "Professional Notetaker",
            instructions: prompt,
            // model: "gpt-3.5-turbo-0125",
            model: "gpt-3.5-turbo",
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
                            "sections",
                            "content",
                            "transcribed_text"
                        ],    
                        "properties": {
                            "userid": {
                                "type": "string",
                                "description": "The user ID of the person who requested the summary"
                            },
                            "title": {
                                "type": "string",
                                "description": "The title of the entire conversation"
                            },
                            "sections": { 
                                "type": "array",
                                "description": "The sections of the conversation",
                                "items": {
                                    "type": "object",
                                    "required": ["section-title", "section-content"],
                                    "properties": {
                                        "section-title": {
                                            "type": "string",
                                            "description": "The title of the specific conversation"
                                        },
                                        "section-content": {
                                            "type": "string",
                                            "description": "The summary of the conversation in markdown format"
                                        }
                                    }
                                }
                            },
                            "content": {
                                "type": "string",
                                "description": "The full summary of the conversation in markdown format",
                            },
                            "transcribed_text": {
                                "type": "string",
                                "description": "The transcribed text of the conversation"
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
    
    // This method is relies on the fact that everything is added to the end of whisper. Uses LCS.
    async textChanged(newText: string): Promise<string> {
        if (previousText === newText) {
            return "";
        }
    
        let index = -1;
        // Find the index where new unique text starts in the newText by comparing it from the end
        for (let i = 0; i < previousText.length && i < newText.length; i++) {
            if (newText[i] !== previousText[i]) {
                index = i;
                break;
            }
        }
    
        let actualNewText = "";
        if (index !== -1) {
            actualNewText = newText.substring(index);
        } else {
            actualNewText = newText;
        }
    
        // Update previousText with the current newText for the next call
        previousText = newText;
    
        return actualNewText;    
    }
    

    async processSectionTitle(text: string, props: any): Promise<void> {    
        // Split the text into lines
        const lines = text.split('\n');
    
        const processLineWithDelay = (line: string, delay: number) => {
            return new Promise(resolve => setTimeout(() => {
                props.editorRef.current?.appendContent(line);

                console.log(line); // Replace this with the actual code to append the line to the editor
                resolve(line); // Resolve the promise once the line is processed
            }, delay));
        };
    
        // Process each line with a random delay between 10ms and 100ms
        for (const line of lines) {
            const delay = Math.random() * (100 - 10) + 10; 
            await processLineWithDelay(line, delay);
        }
    }


    async processTextToAppend(text: string, props: any): Promise<void> {
        const lines = text.split('\n');
    
        const processLineWithDelay = (line: string, delay: number) => {
            return new Promise(resolve => setTimeout(() => {
                props.editorRef.current?.appendContent(line, 2);

                resolve(line); 
            }, delay));
        };
    
        for (const line of lines) {
            const delay = Math.random() * (100 - 10) + 10; 
            await processLineWithDelay(line, delay);
        }
    }
    
    async summarize(text: string, props: any): Promise<void>{
        console.log(`Transcribed Text: ${text}`);

        const isTextValid = text.includes("The following text is from the user speaker:") && text.includes("The following text is from the other speaker:");
        const isEmpty = text.trim() === "";
        if (isTextValid || isEmpty) {
            console.log("Skipping text.");
            return; // Early return to avoid processing this text
        }
        
        if (props.editorRef.current?.getHTML() === "<p>Notes will be generated here...</p>") {
            props.editorRef.current?.clearContent();
        }
          
        
        try {
            // Create a thread with an id.
            const thread = await openai.beta.threads.create();
            const threadId = thread.id;

            // Create a message.
            const msg = await openai.beta.threads.messages.create(threadId, {
                role: "user",
                content: `${text}`,
            });

            // To ensure textDelta works correctly.
            let additionalCallsCount = 0;
            let waitMoreCalls = false; 

            // Run the assistant.
            const run = openai.beta.threads.runs.createAndStream(
                threadId,
                {
                    assistant_id: this.assistant_id,
                    stream: true
                }
            ).on("event", async (evt: any) => {
                // This event is an example to get JSON output from the assistant. It will be useful to get user_id, title, content, and transcribed_text.
                if (evt.event === "thread.run.requires_action") {
                    const jsonText = evt.data.required_action?.submit_tool_outputs.tool_calls[0].function.arguments;
                    if (jsonText) {
                        try {
                            const parsedJson = JSON.parse(jsonText);
                            console.log(parsedJson);
                            for (let i = 0; i < parsedJson.sections.length; ++i) {
                                let title = parsedJson.sections[i]["section-title"];
                                let content = parsedJson.sections[i]["section-content"];
                                props.editorRef.current?.appendContent(title);
                                props.editorRef.current?.appendContent(content);

                                // Insert this section into the database
                                const { errror } = await supabaseInstance
                                    .from("sections")
                                    .insert([
                                        {
                                            section_title: title,
                                            section_content: content,
                                            parent_note_id: currNoteId
                                        }
                                    ])
                            }
                        }
                        catch (err) {
                            console.log("Waiting for section-title/section-content", err);
                        }
                    }
                }
            });
            // ).on('toolCallDelta', (toolCallDelta: any, snapshot: any) => {
            
            //     if (waitMoreCalls) {
            //         additionalCallsCount++;
            //     }
            
            //     console.log('toolCallDelta:', toolCallDelta);
            //     if (toolCallDelta.type === 'function') {
                    
            //         if (toolCallDelta.function.arguments == "section-content") {
            //             waitMoreCalls = true; // In he right spot
            //         }
            //         if (waitMoreCalls && toolCallDelta.function.arguments != "transcribed_text" && toolCallDelta.function.arguments != "-") {
            //             console.log(toolCallDelta.function.arguments);
            //             props.editorRef.current?.appendContent(toolCallDelta.function.arguments);
            //         }
            //     }
            // });

            // const stream = run.toReadableStream();

            // console.log("stream here", stream)
            // props.editorRef.current?.setContent(stream);
            // const reader = stream.getReader();
            //     let chunks = '';
            //     let result = await reader.read();
            // while (!result.done) {
            //     chunks += new TextDecoder("utf-8").decode(result.value);
            //     result = await reader.read();
            // }
            // console.log(chunks);
            // return chunks;
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
