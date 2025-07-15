import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const pitchNotes = ["Low", "Mid", "High"];
const trainings = [
	{
		id: 1,
		title: "Breathing Control",
		description: "Say 'ah' continuously for 10 seconds.",
		duration: 10,
	},
	{
		id: 2,
		title: "Pitch Practice",
		description: "Match the pitch of the given note for 15 seconds.",
		duration: 15,
	},
	{
		id: 3,
		title: "Volume Control",
		description: "Sing 'ah' softly, then loudly, for 15 seconds.",
		duration: 15,
	},
	{
		id: 4,
		title: "Articulation",
		description: "Pronounce the phrase clearly for 15 seconds.",
		duration: 15,
		phrase: "She sells seashells by the seashore",
	},
];

const Training = () => {
	const [current, setCurrent] = useState(0);
	const [recording, setRecording] = useState(false);
	const [audioURL, setAudioURL] = useState(null);
	const [feedback, setFeedback] = useState("");
	const [score, setScore] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [timeLeft, setTimeLeft] = useState(trainings[0].duration);
	const [timerActive, setTimerActive] = useState(false);
	const [currentNote, setCurrentNote] = useState(pitchNotes[0]);
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const navigate = useNavigate();

	useEffect(() => {
		if (trainings[current].title === "Pitch Practice") {
			setCurrentNote(
				pitchNotes[Math.floor(Math.random() * pitchNotes.length)]
			);
		}
	}, [current]);

	useEffect(() => {
		let timer;
		if (timerActive && timeLeft > 0) {
			timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
		}
		if (timerActive && timeLeft === 0 && recording) {
			stopRecording();
		}
		return () => clearTimeout(timer);
	}, [timerActive, timeLeft, recording]);

	useEffect(() => {
		setTimeLeft(trainings[current].duration);
		setTimerActive(false);
	}, [current]);

	const startRecording = async () => {
		try {
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				setFeedback("🎤 Microphone not supported in this browser.");
				return;
			}
			if (!window.MediaRecorder) {
				setFeedback("⚠️ MediaRecorder not supported in this browser.");
				return;
			}

			setFeedback("");
			setScore(null);
			setAudioURL(null);
			setRecording(true);
			setTimerActive(true);

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorderRef.current = new MediaRecorder(stream);
			audioChunksRef.current = [];

			mediaRecorderRef.current.ondataavailable = (e) => {
				if (e.data.size > 0) audioChunksRef.current.push(e.data);
			};

			mediaRecorderRef.current.onstop = async () => {
				const audioBlob = new Blob(audioChunksRef.current, {
					type: "audio/webm",
				});
				setAudioURL(URL.createObjectURL(audioBlob));
				// Only get AI feedback
			};

			mediaRecorderRef.current.start();
		} catch (err) {
			console.error("🎤 Error accessing mic:", err);
			setFeedback("⚠️ Please allow microphone access to record.");
			setRecording(false);
			setTimerActive(false);
		}
	};

	const stopRecording = () => {
		setRecording(false);
		setTimerActive(false);
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state !== "inactive"
		) {
			mediaRecorderRef.current.stop();
		}
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
			// Check if audio is long enough (e.g., >1 second and >2KB)
			if (audioBlob.size < 2000) {
				setFeedback("Please sing before requesting feedback.");
				setScore(null);
				setIsSubmitting(false);
				return;
			}
			// Optionally check duration
			const audioURL = URL.createObjectURL(audioBlob);
			const audio = new Audio(audioURL);
			audio.onloadedmetadata = async () => {
				if (audio.duration < 1) {
					setFeedback("Recording too short. Please sing before requesting feedback.");
					setScore(null);
					setIsSubmitting(false);
					return;
				}
				// Convert to base64 and send to backend
				const reader = new FileReader();
				reader.onloadend = async () => {
					const base64Audio = reader.result.split(",")[1];
					let lyrics = "";
					if (trainings[current].title === "Articulation" && trainings[current].phrase) {
						lyrics = trainings[current].phrase;
					} else {
						lyrics = trainings[current].description;
					}
					try {
						const res = await axios.post("/api/feedback", {
							audioBase64: base64Audio,
							originalLyrics: lyrics,
							transcribedLyrics: lyrics,
						});
						setFeedback(res.data.feedback || "No feedback generated.");
						setScore(res.data.score || 0);
					} catch (err) {
						setFeedback("Failed to get AI feedback.");
						setScore(0);
					}
					setIsSubmitting(false);
				};
				reader.readAsDataURL(audioBlob);
			};
		} catch (err) {
			setFeedback("Error processing audio.");
			setScore(0);
			setIsSubmitting(false);
		}
	};

	const handleNext = () => {
		setAudioURL(null);
		setFeedback("");
		setScore(null);
		if (current < trainings.length - 1) {
			setCurrent(current + 1);
		} else {
			navigate("/beginner");
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8 relative">
			{/* Gradient Background Blobs */}
			<div className="absolute w-[500px] h-[500px] bg-pink-400 opacity-30 rounded-full blur-[200px] top-[-150px] left-[-120px] z-0 animate-pulse" />
			<div className="absolute w-[450px] h-[450px] bg-purple-600 opacity-25 rounded-full blur-[180px] bottom-[-100px] right-[-100px] z-0 animate-pulse delay-500" />
			<div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 rounded-full blur-[150px] top-[40%] left-[50%] z-0 transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-1000" />

			<div className="bg-pink-50 rounded-lg shadow p-8 max-w-md w-full z-10">
				<h1 className="text-2xl font-bold text-pink-600 mb-4">Training</h1>

				{/* Progress Bar */}
				<div className="mb-6">
					<div className="flex justify-between text-sm text-gray-600 mb-1">
						<span>Progress</span>
						<span>
							{current + 1} / {trainings.length}
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-3 mb-2">
						<div
							className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full"
							style={{
								width: `${((current + 1) / trainings.length) * 100}%`,
							}}
						></div>
					</div>
				</div>

				{/* Current Training */}
				<div className="mb-6">
					<h2 className="text-xl font-semibold mb-2">
						{trainings[current].title}
					</h2>
					<p className="text-gray-700">{trainings[current].description}</p>

					{trainings[current].title === "Pitch Practice" && (
						<div className="mt-4 text-center">
							<span className="text-lg text-gray-600">Target Pitch:</span>
							<div className="text-4xl font-bold text-purple-600">
								{currentNote}
							</div>
						</div>
					)}

					{trainings[current].title === "Articulation" &&
						trainings[current].phrase && (
							<div className="mt-4 text-center">
								<span className="text-lg text-gray-600">Practice Phrase:</span>
								<div className="text-xl font-semibold text-blue-600 mt-1">
									"{trainings[current].phrase}"
								</div>
							</div>
						)}
				</div>

				{/* Timer Bar */}
				<div className="mb-4">
					<div className="flex justify-between text-xs text-gray-500 mb-1">
						<span>Time Left</span>
						<span>{timeLeft}s</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-blue-400 h-2 rounded-full transition-all"
							style={{
								width: `${(timeLeft / trainings[current].duration) * 100}%`,
							}}
						></div>
					</div>
				</div>

				{/* Controls */}
				<div className="flex flex-col items-center mt-4">
					{!recording && !audioURL && (
						<button
							onClick={startRecording}
							className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full"
						>
							Start Recording
						</button>
					)}
					{recording && (
						<button
							onClick={stopRecording}
							className="bg-red-500 text-white px-6 py-2 rounded-full"
						>
							Stop Recording
						</button>
					)}
					{audioURL && (
						<>
							<audio controls src={audioURL} className="w-full mt-4" />
							<button
								onClick={handleSubmit}
								disabled={isSubmitting}
								className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
							>
								{isSubmitting ? "Analyzing..." : "Get Feedback"}
							</button>
						</>
					)}
				</div>

				{/* Feedback */}
				{feedback && (
					<div className="text-green-600 font-semibold text-center mt-4">
						{feedback}
					</div>
				)}
				{score !== null && (
					<div className="text-purple-600 font-bold text-center mt-2">
						Score: {score}/100
					</div>
				)}
				{score !== null && (
					<button
						onClick={handleNext}
						className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full mt-4 w-full"
					>
						{current < trainings.length - 1 ? "Next Training" : "Finish"}
					</button>
				)}
			</div>
		</div>
	);
};

export default Training;
