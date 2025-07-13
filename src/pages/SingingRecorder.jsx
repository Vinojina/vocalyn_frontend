import React, { useState, useRef } from 'react';

function SingingRecorder() {
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);
  const audioRef = useRef(null);

  // Convert blob to base64
  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Start recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedBlob(audioBlob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Get feedback from backend
  const handleGetFeedback = async () => {
    if (!recordedBlob) return;

    const base64Audio = await blobToBase64(recordedBlob);

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64 }),
    });

    const data = await res.json();
    setFeedback(data.feedback);
    setScore(data.score);
  };

  return (
    <div className="p-6 rounded-xl shadow-md max-w-xl mx-auto bg-white text-gray-800 space-y-4">
      <h2 className="text-xl font-bold">🎤 Sing Your Song</h2>

      <div className="space-x-2">
        {!isRecording ? (
          <button
            className="bg-green-500 px-4 py-2 rounded text-white"
            onClick={handleStartRecording}
          >
            Start Recording
          </button>
        ) : (
          <button
            className="bg-red-500 px-4 py-2 rounded text-white"
            onClick={handleStopRecording}
          >
            Stop Recording
          </button>
        )}
      </div>

      {recordedBlob && (
        <div>
          <h3 className="font-semibold mt-4">🎧 Preview</h3>
          <audio ref={audioRef} controls src={URL.createObjectURL(recordedBlob)} />
        </div>
      )}

      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleGetFeedback}
        disabled={!recordedBlob}
      >
        Get Singing Feedback
      </button>

      {feedback && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p><strong>Feedback:</strong> {feedback}</p>
          <p><strong>Score:</strong> {score} / 100</p>
        </div>
      )}
    </div>
  );
}

export default SingingRecorder;
