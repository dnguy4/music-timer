import { faGear, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import TimerDate from "src/components/timerDate";

const ostPlaylists: { [x: string]: { [y: string]: string } } = {
  heart: {
    timerOff: "PLwvhJFemdC7PbBVZmbQN9iPguECgjyHRw",
    timerOn: "PLwvhJFemdC7NaMhp0vmKYO9oIOQOjyHAR",
  },
  star: {
    timerOff: "OLAK5uy_n64BgoFQqplG5_U72otFKMswV0vaKEjOM",
    timerOn: "PLwvhJFemdC7NJVfLHPeqWK_uKVhT78icB",
  },
};

export default function BulletTime() {
  const [game, setGame] = useState("heart");
  const [vidVersion, setVidVersion] = useState("timerOff");
  const [alertTimes, setAlertTimes] = useState([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 30, 60, 120, 180,
  ]);

  const swapPlaylist = () => {
    if (game === "heart") {
      setGame("star");
    } else {
      setGame("heart");
    }
  };
  const toggleTimer = () => {
    setVidVersion(vidVersion === "timerOff" ? "timerOn" : "timerOff");
  };
  const updateAlertTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match("([0-9]+(,s?[0-9]+)*)?")) {
      let newAlertTimes = e.target.value
        .split(",")
        .map((n: string) => parseInt(n, 10));
      newAlertTimes = newAlertTimes.filter((x: any) => !Number.isNaN(x)); // Remove Nans
      setAlertTimes(newAlertTimes);
    }
  };

  const videoId = "Ai8FB3ND_5c";

  return (
    <div className="bg-slate-700">
      <div className="text-5xl font-ironman sm:text-left text-center bg-base-400 text-white p-2">
        <label className={`swap ${game === "star" ? "swap-active" : ""}`}>
          <input
            type="checkbox"
            onChange={swapPlaylist}
            checked={game === "star"}
          />
          <span className="swap-off">Bullet❤️ Timer</span>
          <span className="swap-on">Bullet⭐ Timer</span>
        </label>
      </div>
      <div className="collapse collapse-arrow bg-slate-800 text-white sm:w-1/2 mb-2 sm:ml-2">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title text-xl font-medium">
          Settings <FontAwesomeIcon icon={faGear} />
        </div>
        <div className="grid sm:grid-cols-2 collapse-content">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="pr-2">Heart</span>
              <input
                type="radio"
                name="radio-10"
                className="radio checked:bg-red-500"
                checked={game === "heart"}
                onChange={swapPlaylist}
              />
            </label>
            <label className="label cursor-pointer">
              <span className="pr-2">Star</span>
              <input
                type="radio"
                name="radio-10"
                className="radio checked:bg-yellow-500"
                checked={game === "star"}
                onChange={swapPlaylist}
              />
            </label>
          </div>
          <label className="label cursor-pointer sm:form-control">
            <span className="pr-2">Timer version of songs?</span>
            <input
              type="checkbox"
              className="toggle"
              checked={vidVersion === "timerOn"}
              onChange={toggleTimer}
            ></input>
          </label>
          <label className="label">
            Alert Times (sec):
            <input
              type="text"
              className="input input-bordered ml-2"
              defaultValue={alertTimes.toString()}
              onChange={(e) => updateAlertTime(e)}
              pattern="([0-9]+(,\s?[0-9]+)*)?"
              name="alertTime"
            />
          </label>

          <p className="sm:col-span-2">
            Click on the paused/stopped timer to edit it!
          </p>
        </div>
      </div>
      <TimerDate
        videoId={videoId}
        playlist={ostPlaylists[game][vidVersion]}
        initialTimeLimit={vidVersion === "timerOff" ? 180 : 185}
        voiceAlertTimes={alertTimes}
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
        <Link to={"/"} className="absolute right-1">
          <FontAwesomeIcon icon={faHome} />
        </Link>
      </p>
    </div>
  );
}
