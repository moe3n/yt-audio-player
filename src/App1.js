import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_KEY = "AIzaSyCvC-kAkCyICDSMD1wXxWWkK2eH9qrhe-U";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1); // Initialize to -1

  const audioRef = useRef(null);

  // Fetch songs from YouTube
  const searchSongs = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&key=${API_KEY}&type=video`
      );
      setResults(response.data.items);
      // Initialize playlist with search results
      const newPlaylist = response.data.items.map((video) => ({
        videoId: video.id.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.default.url,
      }));
      setPlaylist(newPlaylist);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Play song when clicked
  const playSong = (videoId, index) => {
    setCurrentVideoId(videoId);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Next song
  const playNext = () => {
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentVideoId(playlist[nextIndex].videoId);
      setCurrentIndex(nextIndex);
      setIsPlaying(true);
    }
  };

  // Previous song
  const playPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentVideoId(playlist[prevIndex].videoId);
      setCurrentIndex(prevIndex);
      setIsPlaying(true);
    }
  };

  // Handle seek bar
  const handleSeek = (e) => {
    const seekTime = e.target.value;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Update time and duration
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current.currentTime);
      });
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current.duration);
      });
    }
  }, [currentVideoId]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          YouTube Audio Player
        </h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search for songs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-96 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={searchSongs}
            className="px-6 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {results.map((video, index) => (
            <div
              key={video.id.videoId}
              onClick={() => playSong(video.id.videoId, index)}
              className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <img
                src={video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
                className="w-16 h-16 rounded-lg"
              />
              <p className="ml-4 text-gray-800">{video.snippet.title}</p>
            </div>
          ))}
        </div>

        {/* Audio Player */}
        {currentVideoId && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Now Playing
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <img
                  src={playlist[currentIndex]?.thumbnail}
                  alt="Thumbnail"
                  className="w-16 h-16 rounded-lg"
                />
                <p className="ml-4 text-gray-800">
                  {playlist[currentIndex]?.title}
                </p>
              </div>

              {/* Hidden audio element */}
              <audio
                ref={audioRef}
                src={`https://www.youtube.com/watch?v=${currentVideoId}`}
                autoPlay={isPlaying}
                onEnded={playNext}
              />

              {/* Player Controls */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={playPrevious}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Previous
                </button>
                <button
                  onClick={togglePlayPause}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button
                  onClick={playNext}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Next
                </button>
              </div>

              {/* Seek Bar */}
              <div className="mt-4">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    {new Date(currentTime * 1000).toISOString().substr(11, 8)}
                  </span>
                  <span>
                    {new Date(duration * 1000).toISOString().substr(11, 8)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
