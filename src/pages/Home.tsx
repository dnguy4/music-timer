import { FormEvent, FormEventHandler, useState } from "react";
import TimerDate from "src/components/timerDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faHeart } from "@fortawesome/free-solid-svg-icons";
import { validatePlaylist } from "../youtube/validatePlaylist";
import { clamp } from "src/components/editableTime";
import { Link } from "react-router-dom";

interface ExampleForm extends HTMLFormElement {
  playlistInput: HTMLInputElement;
  videoIdInput: HTMLInputElement;
  timeLimit: HTMLInputElement;
  alertTime: HTMLInputElement;
}

export default function Home() {
  const [playlistId, setPlaylist] = useState("");
  const [videoId, setVideoId] = useState("lTRiuFIWV54?si=K1rEv0xygqI1cJO5");
  const [vidErrors, setVidErrors] = useState("");
  const [initalTimeLimit, setInitialTimeLimit] = useState(25);
  const [alertTimes, setAlertTimes] = useState([0, 60]);

  const handleSubmit: FormEventHandler<ExampleForm> = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const { playlistInput, videoIdInput, timeLimit, alertTime } =
      e.currentTarget;
    if (playlistInput.value !== playlistId || videoIdInput.value !== videoId) {
      const [validatedPlaylist, validatedVid, errorMsg] =
        await validatePlaylist(playlistInput.value, videoIdInput.value);
      setVidErrors(errorMsg);
      if (validatedPlaylist !== "") setPlaylist(validatedPlaylist);
      if (validatedVid !== "") setVideoId(validatedVid);
    }

    if (timeLimit.valueAsNumber) {
      setInitialTimeLimit(clamp(timeLimit.valueAsNumber, 0, 99));
    }

    let newAlertTimes = alertTime.value
      .split(",")
      .map((n: string) => parseInt(n, 10));
    newAlertTimes = newAlertTimes.filter((x: any) => !Number.isNaN(x)); // Remove Nans
    setAlertTimes(newAlertTimes);
  };

  return (
    <div className="bg-slate-700">
      <div
        className="font-serif sm:text-left text-center 
        space-y-2 bg-base-400 text-white p-2 container mx-auto"
      >
        <p className="text-6xl">Music Timer</p>
        <div className="divider"></div>
        <div className="collapse collapse-arrow bg-slate-800">
          <input type="checkbox" defaultChecked />
          <div className="collapse-title text-xl font-medium w-15">
            Settings <FontAwesomeIcon icon={faGear} />
          </div>
          <div className="flex flex-col collapse-content space-y-1">
            <p>Click on the paused/stopped timer to edit it!</p>
            <form
              onSubmit={handleSubmit}
              className="text-2xl grid grid-cols-1 sm:grid-cols-2 text-left"
            >
              <label>
                Alert Times (sec):
                <input
                  type="text"
                  className="input input-ghost ml-2"
                  defaultValue={"0,60"}
                  pattern="([0-9]+(,\s?[0-9]+)*)?"
                  name="alertTime"
                  placeholder="List of times like 0,60,..."
                />
              </label>
              <label>
                Time Limit (mins):
                <input
                  type="number"
                  className="input input-ghost ml-2"
                  defaultValue={initalTimeLimit}
                  min={1}
                  max={99}
                  step={1}
                  name="timeLimit"
                  placeholder="Type time limit here"
                />
              </label>
              <label>
                Playlist Id:
                <input
                  type="text"
                  className="input input-ghost ml-2"
                  onChange={() => setVidErrors("")}
                  defaultValue={playlistId}
                  name="playlistInput"
                  placeholder="Type playlist id here"
                />
              </label>
              <label>
                Video Id:
                <input
                  type="text"
                  className="input input-ghost ml-2"
                  onChange={() => setVidErrors("")}
                  defaultValue={videoId}
                  name="videoIdInput"
                  placeholder="Type video id here"
                />
              </label>
              <button
                type="submit"
                className="btn btn-accent btn-outline font-sans sm:col-span-2"
              >
                Submit
              </button>
            </form>
          </div>
          <div
            className={`alert alert-error font-mono ${
              vidErrors ? "" : "hidden"
            }`}
          >
            <span>{vidErrors}</span>
          </div>
        </div>
      </div>
      <TimerDate
        videoId={videoId}
        playlist={playlistId}
        initialTimeLimit={initalTimeLimit * 60}
        voiceAlertTimes={alertTimes}
      />
      <div className="grid w-full bg-blue-700">
        <Link to={"/bullet"} className="justify-self-end">
          <FontAwesomeIcon icon={faHeart} />
        </Link>
      </div>
    </div>
  );
}
