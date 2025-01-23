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
    setProgress(0);
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
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        paddingBottom: "120px", // Add space for sticky player
      }}
    >
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

      {/* Hidden video player */}
      {currentVideoId && (
        <iframe
          title="hidden-player"
          style={{ display: "none" }}
          src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&enablejsapi=1`}
          allow="autoplay"
        ></iframe>
      )}

      {/* Sticky bottom player */}
      {currentVideoId && (
        <div
          style={{
            position: "fixed",
            bottom: "0",
            left: "0",
            right: "0",
            background: "#fff",
            padding: "20px",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <img
              src={
                results.find((v) => v.id.videoId === currentVideoId)?.snippet
                  .thumbnails.default.url
              }
              alt="Album art"
              style={{ width: "50px", height: "50px" }}
            />

            <div style={{ flexGrow: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "5px",
                }}
              >
                <button onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? "⏸" : "▶"}
                </button>
                <div style={{ flexGrow: 1 }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    style={{ width: "100%" }}
                    onChange={(e) => setProgress(parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.9em",
                  color: "#666",
                }}
              >
                <span>
                  {Math.floor(progress / 60)}:
                  {String(progress % 60).padStart(2, "0")}
                </span>
                <span>1:40</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
