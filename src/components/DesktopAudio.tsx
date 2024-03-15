/**
 * AudioCaptureButton Component
 *
 * This component provides the backend that, when pressed the "start button", allows the user to share the screen
 * of the application (or entire screen) from where they would like to audio to come from. This component does NOT capture any video 
 * output from any window or screen. The captured audio is stored as a Blob and can be played back using an HTMLAudioElement.
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

import { useRef, useState } from 'react';
import transcribe from '@/API/transcribe';

const AudioCaptureButton = ({ editorRef }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  let chunks: BlobPart[] = [];

  const captureAudio = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // This is required, even though we are not capturing video. Setting this to false throws an error.
        audio: true
      });

      // Remove video tracks from the MediaStream
      mediaStream.getVideoTracks().forEach(track => track.stop());

      const recorder = new MediaRecorder(mediaStream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = async (e) => {
        // We only want to keep the very first audio data and the latest e.data
        // The first audio data is required since it contains the header of the WAV file.
        if (chunks.length > 1) {
          chunks.pop();
        }
        chunks.push(e.data);

        const blob = new Blob(chunks, { "type" : "video/x-matroska;codecs=avc1,opus" });
        const audioURL = window.URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.src = audioURL;
        }
        transcribe(blob, editorRef);
      }

      // Instead of providing a "Stop Capture" button, we can just stop the capture when the mediaStream ends.
      mediaStream.getTracks().forEach(track => {
        track.onended = () => {
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        };
      });
      
      // We want the transcription to be done in real-time, so we will set the interval to 5 seconds. 
      recorder.start(10000);
    } catch (err) {
      console.error('Error capturing audio', err);
    }
  };


  return (
    <div>
      <button onClick={captureAudio}>Start Capture</button>
      <audio ref={audioRef} controls />
    </div>
  );
};

export default AudioCaptureButton;