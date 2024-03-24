// /*
//  This component is used for accessing and processing audio from the user's end. It is capable of
// processing both the audio from the user's microphone and audio from the user's desktop.
// It uses a custom BackendAudioAPI functionality to transcribe and summarize the audio from either source.
// The component consists of a generic function CaptureAudioGeneric that houses most of the functionality
// of the component. It is then used to create two separate components, MicAudioButton and DesktopAudioButton,
// that are used to capture audio from the user's microphone and desktop respectively.

// For the MicAudioButton, the component uses the navigator.mediaDevices.getUserMedia() method to capture audio
// from the user's microphone. A good thing about getUserMedia() is that it allows echoCancellation, noiseSuppression,
// and autoGainControl, which are all very useful for capturing clear audio. 

// For the DesktopAudioButton, the component uses the navigator.mediaDevices.getDisplayMedia() method to capture audio
// from the user's desktop. This method is used to capture both audio and video from the user's desktop. However, the 
// component only captures audio from the user's desktop. The video tracks are removed from the MediaStream before processing.
// */

import { useState } from 'react';
import BackendAudioAPI from '@/API/AudioBackend';

// Initializing the Backend Audio Services
let audioBackend = new BackendAudioAPI();

// Setting up universal variables to keep track of transcription
let firstStringMic: string = "";
let transcriptionTextMic: string = "";
let transcriptionIterationMic: number = 0;

let firstStringDesktop: string = "";
let transcriptionTextDesktop: string = "";
let transcriptionIterationDesktop: number = 0;

let overallTranscription: string = "";

const CaptureAudioGeneric = (
    /**
     * CaptureAudioGeneric
     * 
     * This is a generic function that provides the backend for capturing audio from the user's microphone or desktop.
     * For memory efficiency, whenever the recorder's ondataavailable event is triggered, we only want to keep the very first audio data and the latest e.data.
     * We then keep track of a single variable that holds the entire transcription text and any new
     * transcribed text is appended to it. The transcribed text is then summarized and displayed directly into the editor.
     */
    getMediaStream: () => Promise<MediaStream>,
    captureFrom:string,
    timeSlice: number) => {
    
    return (props: any) => {
        const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
        const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
        let firstString: string;
        let transcriptionText: string;
        let transcriptionIteration: number;
        let chunks: BlobPart[] = [];

        const captureAudio = async () => {
            try {
                const mediaStream = await getMediaStream();
                setMediaStream(mediaStream);

                // If the capture is from desktop...
                if (captureFrom === "Desktop") {
                    // we would first want to remove video tracks
                    mediaStream.getVideoTracks().forEach(track => track.stop());
                                    
                    
                    // And instead of providing a "Stop Capture" button, we can just stop the capture when the mediaStream ends.
                    mediaStream.getTracks().forEach(track => {
                        track.onended = () => {
                            if (recorder.state !== 'inactive') {
                                recorder.stop();
                            }
                        };
                    });

                    // And we would want the transcription-tracking variables to de specific to desktop
                    firstString = firstStringDesktop;
                    transcriptionText = transcriptionTextDesktop;
                    transcriptionIteration = transcriptionIterationDesktop;
                }

                if (captureFrom === "Microphone") {
                    // We would want the transcription-tracking variables to be specific to microphone
                    firstString = firstStringMic;
                    transcriptionText = transcriptionTextMic;
                    transcriptionIteration = transcriptionIterationMic;
                }
    
                const recorder = new MediaRecorder(mediaStream);
                setMediaRecorder(recorder);
    
                recorder.ondataavailable = async (e) => {
                    // We only want to keep the very first audio data and the latest e.data
                    // The first audio data is required since it contains the header of the WAV file.
                    if (chunks.length > 1) {
                        chunks.pop();
                    }
                    chunks.push(e.data);

                    // Create a new blob of the first and latest chunk
                    const blob = new Blob(chunks, { "type": "audio/wav;codecs=opus" });

                    // Checking if the user is speaking
                    let speaking = await audioBackend.isSpeaking(mediaStream);

                    // Only if the user is speaking will we want to transcribe and summarize the audio
                    if (speaking) {
                        // Transcribing the audio
                        if (transcriptionIteration === 0) {
                            // If we have just started the transcription, we want to store the first string separately
                            audioBackend.transcribe(blob).then(text => {
                                firstString = text;
                            })
                            transcriptionText = firstString;
                            transcriptionIteration++;
                        }

                        if (transcriptionIteration > 0) {
                            audioBackend.transcribe(blob).then(text => {
                                transcriptionText += text.slice(firstString.length, text.length).trim();
                            });
                        }

                        // We now update the overall transcription to be the transcription from both the microphone and desktop
                        if (captureFrom === "Microphone") {
                            transcriptionTextMic = transcriptionText;
                        } else {
                            transcriptionTextDesktop = transcriptionText;
                        }
                        
                        let micText = "\n The following text is from the user speaker: \n" + transcriptionTextMic + "\n";
                        let desktopText = "\n The following text is from the other speaker: \n" + transcriptionTextDesktop + "\n";
                        overallTranscription = micText + desktopText;

                        // Summarizing the transcribed text
                        audioBackend.summarize(overallTranscription).then(summary => {

                            // and displaying it directly into the editor
                            props.editorRef.current.setContent(summary);
                        })
                    }
                    
                }
                recorder.start(timeSlice);
            } 
            catch (err) {
                console.log(err)
            }
        };

        const stopAudio = () => {
            if (mediaRecorder && mediaRecorder.state !== "inactive") {
                mediaRecorder.stop();
                console.log("should stop");
            }
        
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        
            console.log("SHOULD STOP");
        }

        return (
            <div>
                <button onClick={captureAudio}>Start {captureFrom} Capture</button>
                <button onClick={stopAudio}>Stop {captureFrom} Capture</button>
            </div>
        )
    }
}

const MicAudioButton = CaptureAudioGeneric(
    /**
     * MicAudioButton Component
     * 
     * This component provides the backend that records audio from the user's microphone every {timeSlice} seconds.
     * The captured audio is stored as a Blob, which is then sent to OpenAI's Whisper API for transcription. The transcribed
     * text is then sent to OpenAI's GPT-3.5-turbo-instruct model for summarization. The summarized text is then displayed
     * directly into the editor.
     * 
     */
    () => navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
        }
    }),
    "Microphone",
    10000
)

const DesktopAudioButton = CaptureAudioGeneric(
    /**
     * DesktopAudioButton Component
     *
     * This component provides the backend that, when pressed the "start button", allows the user to share the screen
     * of the application (or entire screen) from where they would like to audio to come from. This component does NOT capture any video 
     * output from any window or screen. The captured audio is stored as a Blob, which is then sent to OpenAI's Whisper API for transcription.
     * The transcribed text is then sent to OpenAI's GPT-3.5-turbo-instruct model for summarization. The summarized text is then displayed.
     * 
     *
     * Note: This component has some limitations due to the privacy-concerning nature of capturing desktop/system audio as a web application. They are as follows:
     * - This uses the MediaDevices.getDisplayMedia API, which is relatively new and may not be supported by all browsers, especially those on mobile phones.
     * - The primary function of this component is to capture system level or browser level audio from the user's computer. However, the ability to share audio when sharing screen 
     *   is only (currently) supported on Chromium-based browsers like Google Chrome, Brave, Microsoft Edge, etc. While non-Chromium browsers like Firefox and Safari do support the 
     *   new MediaDevices.getDisplayMedia API, they do not support the ability to share audio when sharing screen. This is a limitation of the browsers themselves, and not this component.
     * - Even when using Chromium-based browsers, users must enable the "Share Audio" checkbox when sharing their screen. If not done, no audio will be captured. Moreover, 
     *   sharing audio with screen sharing is only supported when either sharing a browser tab or the entire screen. Sharing a specific application window will NOT capture audio. 
     *   Again, this is a limitation of the browsers themselves, and not this component.
     */
    () => navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true  // This is required, even though we are not capturing video. Setting this to false throws an error.
    }),
    "Desktop",
    10000
)

export { MicAudioButton, DesktopAudioButton }
