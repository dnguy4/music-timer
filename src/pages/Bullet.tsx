import { useState } from "react";
import CountdownApp from "src/components/timerDate";

export default function BulletTime() {
  const [playlist, setPlaylist] = useState(
    "PLwvhJFemdC7PbBVZmbQN9iPguECgjyHRw"
  );

  const swapPlaylist = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Make this more generalizable, split into new route
    // https://developers.google.com/youtube/v3/docs/playlistItems/list
    // Use youtube api to cue first vid
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
      <div className="text-5xl font-ironman text-center bg-stone-800 text-white p-2">
        <label className="swap">
          <input type="checkbox" onChange={(e) => swapPlaylist(e)} />
          <span className="swap-off">Bullet❤️ Timer</span>
          <span className="swap-on">Bullet⭐ Timer</span>
        </label>
      </div>
      <CountdownApp
        videoId={videoId}
        playlist={playlist}
        initialTimeLimit={180}
      />
    </div>
  );
}
