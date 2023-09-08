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

type Props = {
  playlist: string;
  videoId: string;
  initialTimeLimit?: number;
};

export default function CountdownApp(props: Props) {
  const { videoId, playlist, initialTimeLimit = 180 } = props;

  const [secondsRemaining, setSecondsRemaining] = useState(initialTimeLimit);
  const [status, setStatus] = useState(STATUS.STOPPED);
  const [startTime, setStartTime] = useState(Date.now()); // Prevents desync
  const [timeLimit, setTimeLimit] = useState(initialTimeLimit);

  const [player, setPlayer] = useState<YouTubePlayer>();

  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;
  // const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60;

  const colorsConfig: { [x: string]: { [y: string]: string } } = {
    [STATUS.STOPPED]: {
      0: "bg-red-700",
      1: "bg-blue-700",
      2: "bg-green-700",
      3: "bg-green-700",
    },
    [STATUS.STARTED]: {
      0: "bg-red-500",
      1: "bg-blue-500",
      2: "bg-green-500",
      3: "bg-green-500",
    },
  };
  let timerColor: string;
  if (minutesRemaining < 4) {
    timerColor = colorsConfig[status][minutesRemaining];
  } else {
    timerColor = "bg-blue-700";
  }

  const handleStart = () => {
    if (secondsRemaining > 0 && status !== STATUS.STARTED) {
      speechSynthesis.speak(new SpeechSynthesisUtterance(""));
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
    setSecondsRemaining(initialTimeLimit);
    setTimeLimit(initialTimeLimit);
    player?.seekTo(0);
    player?.pauseVideo();
  };

  const timeAlert = (remaining: number, prevRemaining: number) => {
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

  const handleReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    event.target.setVolume(60);
  };
  const opts: YouTubeProps["opts"] = {
    playerVars: {
      autoplay: 0,
      loop: 1,
      ...(playlist !== "" && { list: playlist }),
      listType: "playlist",
      enablejsapi: true,
    },
  };

  return (
    <div className={`container mx-auto min-h-screen ${timerColor}`}>
      <div className="flex flex-col space-y-4 pt-4">
        <YouTube
          className="flex h-parent justify-center"
          videoId={videoId}
          onPlay={handleStart}
          onPause={handleStop}
          onReady={handleReady}
          opts={opts}
        />
        <div
          className="countdown font-mono text-8xl m-auto text-white 
        bg-slate-700 w-full md:w-2/3 justify-center border-y-2 md:border-4 border-sky-500"
        >
          <span
            style={{ "--value": twoDigits(minutesToDisplay) } as CSSProperties}
          />
          :
          <span
            style={{ "--value": twoDigits(secondsToDisplay) } as CSSProperties}
          />
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
        {/* <button className="btn btn-neutral self-center mr-2 hidden sm:block">&lt;</button>
        <button className="btn btn-neutral self-center ml-2 hidden sm:block">&gt;</button> */}
      </div>
    </div>
  );
}
// source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: CallableFunction, delay: number | null) {
  const savedCallback = useRef<CallableFunction | null>(null);

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
const twoDigits = (num: number) => String(num).padStart(2, "0");
