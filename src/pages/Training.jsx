import { useState, useRef } from "react";
import MicOn from "/src/assets/micon.png";
import MicOff from "/src/assets/micoff.png";

const VoiceTrainingPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState("");
  const mediaRecorderRef = useRef(null); 

  const exercises = [
    {
      title: "Breathing Control",
      instruction: "Take a deep breath and say 'Ahhhh' for 10 seconds",
      duration: 10,
    },
    {
      title: "Pitch Practice",
      instruction: "Sing the note 'Do' and hold it steady for 8 seconds",
      duration: 8,
    },
    {
      title: "Volume Control",
      instruction: "Say 'Hello' softly, then loudly, alternating for 6 seconds",
      duration: 6,
    },
    {
      title: "Articulation",
      instruction: "Repeat 'Red leather, yellow leather' clearly for 7 seconds",
      duration: 7,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentExercise = {
    ...exercises[currentIndex],
    current: currentIndex + 1,
    total: exercises.length,
  };

  const handleNextExercise = () => {
    setProgress(0);
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setTimeout(handleNextExercise, 1000); 
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.start();
      setIsRecording(true);

      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            stopRecording();
            return 100;
          }
          return prev + (100 / currentExercise.duration / 10);
        });
      }, 100);

      setTimeout(() => {
        stopRecording();
      }, currentExercise.duration * 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-purple-500">AI Voice Training</h1>
          <div className="text-sm text-gray-500">
            Exercise {currentExercise.current} of {currentExercise.total}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">Training Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-gray-500">{Math.round(progress)}%</div>
        </div>

        <div className="space-y-4 text-center">
          <h2 className="text-xl font-bold text-gray-800">{currentExercise.title}</h2>
          <p className="text-gray-600">{currentExercise.instruction}</p>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`mx-auto mt-6 w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isRecording 
                ? 'text-white animate-pulse' 
                : 'text-white hover:bg-white'
            }`}
          >
            {isRecording ? (
              <img src={MicOff} alt="Stop Recording" className="w-12 h-12" />
            ) : (
              <img src={MicOn} alt="Start Recording" className="w-12 h-12" />
            )}
            <span className="sr-only">{isRecording ? "Stop Recording" : "Start Recording"}</span>
          </button>

          <p className="text-gray-500 mt-2">
            {isRecording ? `Recording... ${currentExercise.duration}s` : 'Click to Start Recording'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceTrainingPage;
