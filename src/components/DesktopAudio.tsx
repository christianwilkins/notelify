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

import { useEffect, useRef, useState } from 'react';

const AudioCaptureButton = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<BlobPart[]>([]);

  const captureAudio = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // This is required, even though we are not capturing video. Setting this to false throws an error.
        audio: true
      });

      const recorder = new MediaRecorder(mediaStream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (e) => {
        setChunks((prev) => {
          const updatedChunks = [...prev, e.data];
          const blob = new Blob(updatedChunks, { 'type' : 'audio/wav; codecs=opus' });
          const audioURL = window.URL.createObjectURL(blob);
          if (audioRef.current) {
            audioRef.current.src = audioURL;
          }
          return updatedChunks;
        });
      };

      // Instead of providing a "Stop Capture" button, we can just stop the capture when the mediaStream ends.
      mediaStream.getTracks().forEach(track => {
        track.onended = () => {
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        };
      });

      recorder.start();
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