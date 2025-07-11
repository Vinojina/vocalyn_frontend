import React, { useEffect, useRef, useState } from "react";

const PitchDetectorZCR = () => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const bufferRef = useRef(new Float32Array(2048));
  const [zcrValue, setZcrValue] = useState(null);
  const [noteEstimate, setNoteEstimate] = useState("—");

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      source.connect(analyserRef.current);
      detectZCR();
    };

    init();
  }, []);

  const detectZCR = () => {
    const loop = () => {
      analyserRef.current.getFloatTimeDomainData(bufferRef.current);
      const zcr = computeZCR(bufferRef.current);
      setZcrValue(zcr.toFixed(3));

      // crude note estimate based on ZCR thresholds
      if (zcr < 0.02) setNoteEstimate("Low");
      else if (zcr < 0.08) setNoteEstimate("Mid");
      else setNoteEstimate("High");

      requestAnimationFrame(loop);
    };

    loop();
  };

  const computeZCR = (buffer) => {
    let zeroCrossings = 0;
    for (let i = 1; i < buffer.length; i++) {
      if ((buffer[i - 1] >= 0 && buffer[i] < 0) || (buffer[i - 1] < 0 && buffer[i] >= 0)) {
        zeroCrossings++;
      }
    }
    return zeroCrossings / buffer.length;
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 text-center max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold text-gray-700">🎵 ZCR Pitch Estimator</h2>
      <p className="text-sm text-gray-500 mb-4">Real-time pitch trend using Zero Crossing Rate</p>
      <div className="text-lg text-gray-700">
        <p>Zero Crossing Rate: <span className="font-semibold text-purple-600">{zcrValue || "—"}</span></p>
        <p className="mt-2">Pitch Estimate: <span className="font-bold text-pink-500">{noteEstimate}</span></p>
      </div>
    </div>
  );
};

export default PitchDetectorZCR;
