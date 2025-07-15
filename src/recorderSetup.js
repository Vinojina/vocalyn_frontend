// recorderSetup.js
// Helper to setup RecordRTC for WAV recording
import RecordRTC from 'recordrtc';

export async function getWavRecorder() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new RecordRTC(stream, {
    type: 'audio',
    mimeType: 'audio/wav',
    recorderType: RecordRTC.StereoAudioRecorder,
    numberOfAudioChannels: 2, // stereo
    desiredSampRate: 44100 // CD quality for best compatibility
  });
  return { recorder, stream };
}
