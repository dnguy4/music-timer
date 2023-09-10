import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import CountdownApp from "src/components/timerDate";

export default function BulletTime() {
  const [playlist, setPlaylist] = useState(
    "PLwvhJFemdC7PbBVZmbQN9iPguECgjyHRw"
  );

  const swapPlaylist = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Star
      setPlaylist("OLAK5uy_n64BgoFQqplG5_U72otFKMswV0vaKEjOM");
      //       player?.cueVideoById("yEBMQwAWGFI");
    } else {
      // Heart
      setPlaylist("PLwvhJFemdC7PbBVZmbQN9iPguECgjyHRw");
      //  player?.cueVideoById("Ai8FB3ND_5c");
    }
  };
  const videoId = "Ai8FB3ND_5c";

  return (
    <div>
      <div className="text-5xl font-ironman sm:text-left text-center bg-base-400 text-white p-2">
        <label className="swap">
          <input type="checkbox" onChange={(e) => swapPlaylist(e)} />
          <span className="swap-off">Bullet❤️ Timer</span>
          <span className="swap-on">Bullet⭐ Timer</span>
        </label>
        <div
          className="tooltip tooltip-left 
          text-sm font-sans absolute right-2 top-2"
          data-tip="Click the emoji to swap games!"
        >
          <FontAwesomeIcon icon={faInfoCircle} />
        </div>
      </div>
      <CountdownApp
        videoId={videoId}
        playlist={playlist}
        initialTimeLimit={180}
        voiceAlert={true}
      />
      <p className="text-sm font-sans italic text-white p-1">
        This website is not associated with{" "}
        <a
          href="https://www.level99store.com"
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          Level 99 Games
        </a>{" "}
        or the{" "}
        <a
          href="https://www.level99store.com/products/bullet-star"
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          Bullet franchise.
        </a>
        .
      </p>
    </div>
  );
}
