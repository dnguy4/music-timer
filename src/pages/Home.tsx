import { useState } from "react";
import CountdownApp from "src/components/timerDate";

export default function Home() {
  const videoId = "lTRiuFIWV54?si=K1rEv0xygqI1cJO5";
  return (
    <div>
      <div className="text-5xl font-serif text-center bg-stone-800 text-white p-2">
        Music Timer
      </div>
      <CountdownApp videoId={videoId} playlist="" initialTimeLimit={25 * 60} />
    </div>
  );
}
