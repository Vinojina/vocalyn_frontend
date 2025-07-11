import React, { useEffect, useRef, useState } from "react";
import * as pitchy from "pitchy"; 

const PitchDetector = ({targetNote}) => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const bufferRef = useRef(new Float32Array(1024));
  const [note, setNote] = useState("—");
  const [pitch, setPitch] = useState(null);

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      detect();
    };

    init();
  }, []);

  const detect = () => {
    const loop = () => {
      const buffer = bufferRef.current;
      analyserRef.current.getFloatTimeDomainData(buffer);

      const [detectedPitch, clarity] = pitchy.getPitch(buffer, audioContextRef.current.sampleRate); // ✅ call getPitch()

      if (clarity > 0.95) {
        setPitch(detectedPitch.toFixed(2));
        setNote(toNote(detectedPitch));
      } else {
        setPitch(null);
        setNote("—");
      }

      requestAnimationFrame(loop);
    };

    loop();
  };

  const toNote = (freq) => {
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const A4 = 440;
    const semitones = Math.round(12 * Math.log2(freq / A4));
    const index = (semitones + 69) % 12;
    const octave = Math.floor((semitones + 69) / 12);
    return `${noteNames[index]}${octave}`;
  };

  return (
    <div className="text-center mt-6 bg-white p-4 rounded-lg shadow">
    <p className="text-sm text-gray-500">Pitch (Hz)</p>
    <p className="text-xl font-semibold text-purple-600">{pitch || "—"}</p>
    <p className="text-sm mt-2 text-gray-500">Detected Note</p>
    <p className={`text-3xl font-bold ${note.startsWith(targetNote) ? "text-green-500" : "text-red-500"}`}>
      {note}
    </p>
  </div>
);
};

export default PitchDetector;
