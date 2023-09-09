import { FormEvent, FormEventHandler, useState } from "react";
import CountdownApp from "src/components/timerDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

interface ExampleForm extends HTMLFormElement {
  playlistInput: HTMLInputElement;
  videoIdInput: HTMLInputElement;
}

export default function Home() {
  const [playlist, setPlaylist] = useState("");
  const [videoId, setVideoId] = useState("lTRiuFIWV54?si=K1rEv0xygqI1cJO5");

  const handleSubmit: FormEventHandler<ExampleForm> = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const { playlistInput, videoIdInput } = e.currentTarget;
    // Validate that videoId input belongs to playlist? Or override
    // Add error message and validate probably
    // Also strip ID from user's url if possible
    setPlaylist(playlistInput.value);
    setVideoId(videoIdInput.value);
  };

  return (
    <div>
      <div
        className="text-6xl font-serif sm:text-left text-center 
        space-y-2 bg-base-400 text-white p-2 container mx-auto"
      >
        <p>Music Timer</p>
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
                defaultValue={playlist}
                name="playlistInput"
                placeholder="Type playlist id here"
              />
            </label>
            <label>
              Video Id:
              <input
                type="text"
                className="input input-ghost"
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
        {/* <button className="btn">
          <FontAwesomeIcon icon={faInfoCircle} />
        </button> */}
      </div>
      <CountdownApp videoId={videoId} playlist="" initialTimeLimit={25 * 60} />
    </div>
  );
}
