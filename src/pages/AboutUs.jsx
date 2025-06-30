import React from "react";
import { useNavigate } from "react-router-dom";
import Voice from '/src/assets/voice.png';
import Progress from '/src/assets/learning.png'
import Premium from '/src/assets/premium1.png';


const AboutUs = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="flex flex-1 justify-center items-center">
                <div className="bg-white rounded-2xl shadow-2xl px-20 py-16 max-w-7xl w-full">
                    <h1 className="text-4xl font-bold mb-14 text-center text- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent m-4">
                        Why choose AI voice trainer?
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div className="p-12 bg-gray-50 rounded-xl shadow-md flex flex-col items-center">
                            <img src={Voice} alt="Voice Analysis" className="w-10 h-10 mb-6" />
                            <h3 className="text-2xl font-semibold mb-5 text-purple-600 text-center">AI voice Analysis</h3>
                            <p className="text-gray-600 text-center text-lg">
                                Advanced AI technology analyzes your voice in real-time
                            </p>
                        </div>
                        <div className="p-12 bg-gray-50 rounded-xl shadow-md flex flex-col items-center">
                            <img src={Progress} alt="Progress Tracking" className="w-10 h-10 mb-5" />
                            <h3 className="text-2xl font-semibold mb-5 text-purple-600 text-center">Progressive Learning</h3>
                            <p className="text-gray-600 text-center text-lg">
                                Unlock levels as you improve: <br />
                                <span className="inline-block mt-2 font-bold text-blue-300">
                                    Beginner → Intermediate → Advanced
                                </span>
                            </p>
                        </div>
                        <div className="p-12 bg-gray-50 rounded-xl shadow-md flex flex-col items-center">
                            <img src={Premium} alt="Premium Songs" className="w-10 h-10 mb-5" />
                            <h3 className="text-2xl font-semibold mb-5 text-purple-600 text-center">Premium songs</h3>
                            <p className="text-gray-600 text-center text-lg">
                                Practice with high-quality backing tracks and professional guidance
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="w-full text-center text-sm text-gray-500 border-t border-gray-200 py-4 mt-12">
                © All rights reserved. Vocalyn
            </footer>
        </div>
    );
};

export default AboutUs;