import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./styles.css";

const API_KEY = "AIzaSyCvC-kAkCyICDSMD1wXxWWkK2eH9qrhe-U"; // Replace with your key

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef(null);

  // YouTube IFrame API initialization
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = initializePlayer;
      document.body.appendChild(tag);
    } else {
      initializePlayer();
    }
  }, []);

  const initializePlayer = () => {
    playerRef.current = new window.YT.Player("player", {
      height: "360",
      width: "640",
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  //   const initializePlayer = () => {
  //     playerRef.current = new window.YT.Player("player", {
  //       height: "360",
  //       width: "640",
  //       playerVars: {
  //         autoplay: 0,
  //         controls: 1,
  //         modestbranding: 1,
  //       },
  //       events: {
  //         onReady: onPlayerReady,
  //         onStateChange: onPlayerStateChange,
  //       },
  //     });
  //   };

  const onPlayerReady = (event) => {
    console.log("Player ready");
  };

  const onPlayerStateChange = (event) => {
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        setIsPlaying(true);
        break;
      case window.YT.PlayerState.PAUSED:
        setIsPlaying(false);
        break;
      case window.YT.PlayerState.ENDED:
        setIsPlaying(false);
        break;
    }
  };

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

  // Fixed click handler
  const playSong = (videoId) => {
    if (playerRef.current) {
      playerRef.current.loadVideoById(videoId);
      setIsPlaying(true);
      setCurrentVideoId(videoId);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-card main-content">
        <h1>YouTube Audio Player</h1>
        <div className="glass-card search-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs..."
            className="search-input"
          />
          <button
            onClick={searchSongs}
            className="glass-card"
            style={{
              background: "rgba(74, 144, 226, 0.6)",
              color: "white",
            }}
          >
            Search
          </button>
        </div>

        <div className="glass-card video-container">
          <div id="player"></div>
        </div>

        <div style={{ marginTop: "20px" }}>
          {results.map((video) => (
            <div
              key={video.id.videoId}
              onClick={() => playSong(video.id.videoId)}
              className="glass-card song-item"
            >
              <img
                src={video.snippet.thumbnails.default.url}
                alt="thumbnail"
                style={{ width: "60px", height: "60px", marginRight: "15px" }}
              />
              <p style={{ margin: 0 }}>{video.snippet.title}</p>
            </div>
          ))}
        </div>

        {currentVideoId && (
          <div className="player-container glass-card">
            <div className="player-content">
              <img
                src={
                  results.find((v) => v.id.videoId === currentVideoId)?.snippet
                    .thumbnails.default.url
                }
                alt="Album art"
                className="player-thumbnail"
              />
              <div className="player-controls">
                <button
                  className="control-button"
                  onClick={() => playerRef.current.playVideo()}
                >
                  ▶
                </button>
                <button
                  className="control-button"
                  onClick={() => playerRef.current.pauseVideo()}
                >
                  ⏸
                </button>
                <input
                  type="range"
                  className="progress-bar"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => playerRef.current.seekTo(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Style constants
// const stickyPlayerStyle = {
//   position: "fixed",
//   bottom: "0",
//   left: "0",
//   right: "0",
//   background: "white",
//   padding: "15px",
//   boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
//   zIndex: 1000,
// };

// const playerContentStyle = {
//   maxWidth: "800px",
//   margin: "0 auto",
//   display: "flex",
//   alignItems: "center",
//   gap: "20px",
// };

// const controlsStyle = {
//   display: "flex",
//   alignItems: "center",
//   gap: "10px",
// };

// const buttonStyle = {
//   padding: "8px 12px",
//   backgroundColor: "#007bff",
//   color: "white",
//   border: "none",
//   borderRadius: "4px",
//   cursor: "pointer",
// };

export default App;
