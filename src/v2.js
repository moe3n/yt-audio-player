import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "AIzaSyCvC-kAkCyICDSMD1wXxWWkK2eH9qrhe-U";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const searchSongs = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&key=${API_KEY}&type=video`
      );
      setResults(response.data.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const playSong = (videoId) => {
    setCurrentVideoId(videoId);
    setIsPlaying(true);
    setProgress(0); // Reset progress when new song starts
  };

  // Simulate progress update
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>YouTube Audio Player</h1>
      <div>
        <input
          type="text"
          placeholder="Search for songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button onClick={searchSongs} style={{ padding: "10px 20px" }}>
          Search
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        {results.map((video) => (
          <div
            key={video.id.videoId}
            onClick={() => playSong(video.id.videoId)}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            <img
              src={video.snippet.thumbnails.default.url}
              alt={video.snippet.title}
              style={{ marginRight: "10px" }}
            />
            <p>{video.snippet.title}</p>
          </div>
        ))}
      </div>

      {currentVideoId && (
        <div style={{ marginTop: "20px" }}>
          <h2>Now Playing</h2>
          <iframe
            title="YouTube Audio Player"
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          {/* Progress Bar */}
          <div style={{ marginTop: "10px", width: "560px" }}>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              style={{ width: "100%" }}
              readOnly
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                {Math.floor(progress / 60)}:
                {String(progress % 60).padStart(2, "0")}
              </span>
              <span>1:40</span>{" "}
              {/* Replace with actual duration if available */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
