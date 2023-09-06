// Modified from https://stackoverflow.com/a/61572623
import { useState, useEffect, useRef, CSSProperties } from "react";
import YouTube, {
  YouTubeEvent,
  YouTubeProps,
  YouTubePlayer,
} from "react-youtube";
import invariant from "tiny-invariant";

const STATUS = {
  STARTED: "Started",
  STOPPED: "Stopped",
};

const INITIAL_COUNT = 180;

export default function CountdownApp() {
  const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_COUNT);
  const [status, setStatus] = useState(STATUS.STOPPED);
  const [startTime, setStartTime] = useState(Date.now()); // Prevents desync
  const [timeLimit, setTimeLimit] = useState(INITIAL_COUNT);

  const [player, setPlayer] = useState();
  const [playlist, setPlaylist] = useState(
    "PLwvhJFemdC7PbBVZmbQN9iPguECgjyHRw"
  );

  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;
  const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60;

  const timerColors = {
    notstarted: "container mx-auto min-h-screen bg-green-700",
    starting: "container mx-auto min-h-screen bg-green-500",
    stopping: "container mx-auto min-h-screen bg-red-500",
    stop: "container mx-auto min-h-screen bg-red-700",
  };
  let timerClass;
  if (status === STATUS.STOPPED && minutesRemaining > 0) {
    timerClass = timerColors["notstarted"];
  } else if (status === STATUS.STOPPED) {
    timerClass = timerColors["stop"];
  } else if (minutesRemaining > 0) {
    timerClass = timerColors["starting"];
  } else {
    timerClass = timerColors["stopping"];
  }

  const handleStart = () => {
    if (secondsRemaining > 0 && status !== STATUS.STARTED) {
      setStatus(STATUS.STARTED);
      setStartTime(Date.now());
      player?.playVideo();
    }
  };
  const handleStop = () => {
    if (status !== STATUS.STOPPED) {
      setStatus(STATUS.STOPPED);
      setTimeLimit(secondsRemaining);
      player?.pauseVideo();
    }
  };
  const handleReset = () => {
    setStatus(STATUS.STOPPED);
    setSecondsRemaining(INITIAL_COUNT);
    setTimeLimit(INITIAL_COUNT);
    player?.seekTo(0);
    player?.pauseVideo();
  };

  const timeAlert = (remaining, prevRemaining) => {
    const synth = window.speechSynthesis;
    if (synth.speaking || prevRemaining === remaining) return;

    if (remaining > 0 && remaining % 60 === 0) {
      const u = new SpeechSynthesisUtterance();
      u.text =
        minutesRemaining.toString() +
        (minutesRemaining > 1 ? " minutes left" : "minute left");
      synth.cancel();
      synth.speak(u);
    } else if (remaining === 30) {
      const u = new SpeechSynthesisUtterance("30 seconds left");
      synth.cancel();
      synth.speak(u);
    } else if (remaining <= 10) {
      const u = new SpeechSynthesisUtterance(remaining.toString());
      u.rate = 4;
      synth.speak(u);
    }
  };

  useInterval(
    () => {
      const diff = Date.now() - startTime;
      let remaining = timeLimit - Math.floor(diff / 1000);
      if (remaining <= 0) {
        setStatus(STATUS.STOPPED);
        remaining = 0;
        player.pauseVideo();
      }
      timeAlert(remaining, secondsRemaining);
      setSecondsRemaining(remaining);
    },
    status === STATUS.STARTED ? 200 : null
    // passing null stops the interval
  );

  const handleReady = (event) => {
    setPlayer(event.target);
    event.target.setVolume(60);
  };
  const swapPlaylist = (e) => {
    if (e.target.checked) {
      // Star
      setPlaylist("OLAK5uy_n64BgoFQqplG5_U72otFKMswV0vaKEjOM");
      player?.cueVideoById("yEBMQwAWGFI");
    } else {
      // Heart
      setPlaylist("PLwvhJFemdC7PbBVZmbQN9iPguECgjyHRw");
      player?.cueVideoById("Ai8FB3ND_5c");
    }
  };
  const opts = {
    playerVars: {
      autoplay: 0,
      loop: 1,
      list: playlist,
      listType: "playlist",
      enablejsapi: true,
    },
  };

  return (
    // <div className="container mx-auto min-h-screen bg-green-500/80">
    <div className={timerClass}>
      <div className="flex flex-col text-center space-y-4">
        <h1 className="text-5xl font-extrabold font-mono text-white pt-4">
          Bullet
          <label className="swap swap-flip text-5xl">
            <input type="checkbox" onChange={(e) => swapPlaylist(e)} />
            <div className="swap-off">❤️</div>
            <div className="swap-on">⭐</div>
          </label>
          Timer
        </h1>
        <YouTube
          className="grid justify-items-center"
          videoId="Ai8FB3ND_5c"
          onPlay={handleStart}
          onPause={handleStop}
          onReady={handleReady}
          opts={opts}
        />
      </div>
      <div className="flex flex-col space-y-4 pt-4">
        <div className="countdown font-mono text-8xl m-auto text-white bg-slate-700 w-2/3 justify-center border-4 border-sky-500">
          <span style={{ "--value": twoDigits(hoursToDisplay) }} />
          :
          <span style={{ "--value": twoDigits(minutesToDisplay) }} />
          :
          <span style={{ "--value": twoDigits(secondsToDisplay) }} />
        </div>
        <div className="join justify-center">
          <button onClick={handleStart} className="btn btn-primary join-item">
            Start
          </button>
          <button onClick={handleStop} className="btn btn-secondary join-item">
            Stop
          </button>
          <button onClick={handleReset} className="btn btn-neutral join-item">
            Reset
          </button>
          <button
            onClick={() => {
              player?.setShuffle(true);
              player?.nextVideo();
              player?.stopVideo();
            }}
            className="btn btn-neutral join-item"
          >
            Shuffle
          </button>
        </div>
        {/* <div>Status: {status}</div> */}
      </div>
    </div>
  );
}
// source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef(null);

  // Remember the latest callback.
  useEffect(() => {
    invariant(savedCallback, "callback is required");
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      invariant(savedCallback.current, "callback is required");
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// https://stackoverflow.com/a/2998874/1673761
const twoDigits = (num) => String(num).padStart(2, "0");
