import { FormEvent, FormEventHandler, useState } from "react";
import TimerDate from "src/components/timerDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { validatePlaylist } from "../youtube/validatePlaylist";

interface ExampleForm extends HTMLFormElement {
  playlistInput: HTMLInputElement;
  videoIdInput: HTMLInputElement;
}

export default function Home() {
  const [playlistId, setPlaylist] = useState("");
  const [videoId, setVideoId] = useState("lTRiuFIWV54?si=K1rEv0xygqI1cJO5");
  const [vidErrors, setVidErrors] = useState("");

  const handleSubmit: FormEventHandler<ExampleForm> = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const { playlistInput, videoIdInput } = e.currentTarget;

    const [validatedPlaylist, validatedVid, errorMsg] = await validatePlaylist(
      playlistInput.value,
      videoIdInput.value
    );
    setVidErrors(errorMsg);
    if (validatedPlaylist !== "") setPlaylist(validatedPlaylist);
    if (validatedVid !== "") setVideoId(validatedVid);
  };

  return (
    <div>
      <div
        className="font-serif sm:text-left text-center 
        space-y-2 bg-base-400 text-white p-2 container mx-auto"
      >
        <p className="text-6xl">Music Timer</p>
        <div className="collapse collapse-arrow bg-base-200">
          <input type="checkbox" defaultChecked />
          <div className="collapse-title text-xl font-medium w-15">
            Settings <FontAwesomeIcon icon={faGear} />
          </div>
          <div className="flex flex-col collapse-content">
            <p>Click on the paused/stopped timer to edit the limit!</p>
            <form
              onSubmit={handleSubmit}
              className="text-2xl flex flex-col md:flex-row
              justify-center"
            >
              {/* <label>
                Time Limit (mins):
                <input
                  type="number"
                  className="input input-ghost text-l"
                  // onChange={() => setVidErrors("")}
                  defaultValue={25}
                  name="initalTimeLimit"
                  placeholder="Type time limit here"
                />
              </label> */}
              <label>
                Playlist Id:
                <input
                  type="text"
                  className="input input-ghost"
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
                  className="input input-ghost"
                  onChange={() => setVidErrors("")}
                  defaultValue={videoId}
                  name="videoIdInput"
                  placeholder="Type video id here"
                />
              </label>
              <button
                type="submit"
                className="btn btn-accent btn-outline font-sans sm:ml-1"
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
        initialTimeLimit={25 * 60}
      />
    </div>
  );
}
