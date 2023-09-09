import { FormEvent, FormEventHandler, useState } from "react";
import CountdownApp from "src/components/timerDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
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

    const [playlistOk, videoOk, errorMsg] = await validatePlaylist(
      playlistInput.value,
      videoIdInput.value
    );
    setVidErrors(errorMsg);
    if (playlistOk) setPlaylist(playlistInput.value);
    if (videoOk) setVideoId(videoIdInput.value);
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
          <form
            onSubmit={handleSubmit}
            className="text-2xl flex flex-col md:flex-row 
            justify-center collapse-content"
          >
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
          <div
            className={`alert alert-error font-mono ${
              vidErrors ? "" : "hidden"
            }`}
          >
            <span>{vidErrors}</span>
          </div>
        </div>
        {/* <button className="btn">
          <FontAwesomeIcon icon={faInfoCircle} />
        </button> */}
      </div>
      <CountdownApp
        videoId={videoId}
        playlist={playlistId}
        initialTimeLimit={25 * 60}
      />
    </div>
  );
}
