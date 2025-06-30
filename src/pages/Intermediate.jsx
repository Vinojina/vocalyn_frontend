import BackIcon from "/src/assets/back.png";
import PlayCircle from "/src/assets/play.png";

const Beginner = () => {
    const songs = [
      {
        title: "Happy Birthday",
        type: "Traditional",
        level: "Easy",
        duration: "2.30",
      },
      {
        title: "Twinkle Twinkle Little Star",
        type: "Traditional",
        level: "Easy",
        duration: "1.45",
      },
      {
        title: "Mary Had a Little Lamb",
        type: "Traditional",
        level: "Easy",
        duration: "2.00",
      },
      {
        title: "Row Row Row Your Boat",
        type: "Traditional",
        level: "Easy",
        duration: "2.15",
      },
      {
        title: "Baa Baa Black Sheep",
        type: "Traditional",
        level: "Easy",
        duration: "1.50",
      },
      {
        title: "Old MacDonald Had a Farm",
        type: "Traditional",
        level: "Easy",
        duration: "2.10",
      },
      {
        title: "London Bridge Is Falling Down",
        type: "Traditional",
        level: "Easy",
        duration: "1.55",
      },
      {
        title: "If You're Happy and You Know It",
        type: "Traditional",
        level: "Easy",
        duration: "2.05",
      },
    ];
  
    return (
      <div className="min-h-screen bg-white flex flex-col items-center px-4 py-6 text-pink-600">
        {/* Header */}
        <div className="w-full max-w-3xl">
          <div className="flex items-center mb-4">
                    <img src={BackIcon} alt="backicon" className="w-6 h-6 mr-2 cursor-pointer text-black" />
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Intermediate</h1>
          </div>
          <p className="text-center p-5 text-pink-400 mb-6 text-sm">
            Choose your skill level and start practicing
          </p>
        </div>
  
        {/* Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {songs.map((song, index) => (
            <div
              key={index}
              className="border-b pb-4 flex flex-col space-y-1 text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">{song.title}</h2>
                  <p className="text-sm text-pink-400">{song.type}</p>
                  <p className="text-sm text-black">{song.duration}</p>
                </div>
                <p className="text-sm text-black">{song.level}</p>
              </div>
              <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full px-4 py-2 mt-2 hover:from-pink-600 hover:to-purple-600 transition">
                <img src={PlayCircle} alt="play"className="w-5 h-5" />
                Practise song
              </button>
            </div>
          ))}
        </div>
  
        {/* Footer */}
        <footer className="mt-auto pt-6 text-xs text-black opacity-60">
          © All rights reserved. <span className="font-semibold">Vocalyn</span>
        </footer>
      </div>
    );
  };
  
  export default Beginner;