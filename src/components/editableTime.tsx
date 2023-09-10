import { CSSProperties, useEffect, useState } from "react";
import useComponentVisible from "src/youtube/useComponentVisible";

const twoDigits = (num: number) => String(num).padStart(2, "0");
const clamp = (val: number, min: number, max: number) => {
  return val > max ? max : val < min ? min : val;
};

interface Props {
  minutesToDisplay: number;
  secondsToDisplay: number;
  onSubmit: CallableFunction;
  disableEditing: boolean;
}

export default function EditableTime(props: Props) {
  const { minutesToDisplay, secondsToDisplay, onSubmit, disableEditing } =
    props;
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const [seconds, setSeconds] = useState(secondsToDisplay);
  const [minutes, setMinutes] = useState(minutesToDisplay);

  useEffect(() => {
    if (!isComponentVisible) {
      let newMins = clamp(minutes, 0, 99);
      let newSecs = clamp(seconds, 0, 59);
      onSubmit(newMins * 60 + newSecs);
    } else {
      setMinutes(minutesToDisplay);
      setSeconds(secondsToDisplay);
    }
  }, [isComponentVisible]);

  if (disableEditing && isComponentVisible) {
    setIsComponentVisible(false);
  }

  return (
    <div
      ref={ref}
      className="m-auto text-white 
      md:w-2/3 border-y-2 md:border-4 border-sky-500 w-full"
    >
      {!isComponentVisible && (
        <div
          className="countdown font-mono text-8xl bg-slate-700 w-full justify-center"
          onClick={() => {
            if (disableEditing === false) setIsComponentVisible(true);
          }}
        >
          <span
            style={{ "--value": twoDigits(minutesToDisplay) } as CSSProperties}
          />
          :
          <span
            style={{ "--value": twoDigits(secondsToDisplay) } as CSSProperties}
          />
        </div>
      )}
      {isComponentVisible && (
        <div
          className="font-mono text-8xl bg-gray-200 text-black text-center
        flex flex-row place-content-center"
        >
          <input
            type="number"
            max={99}
            min={0}
            className="input text-8xl h-full w-1/2 bg-inherit text-right"
            defaultValue={twoDigits(minutesToDisplay)}
            onChange={(e) => setMinutes(e.target.valueAsNumber)}
          />
          :
          <input
            type="number"
            max={59}
            min={0}
            className="text-8xl w-1/2 bg-inherit"
            defaultValue={twoDigits(secondsToDisplay)}
            onChange={(e) => setSeconds(e.target.valueAsNumber)}
          />
        </div>
      )}
    </div>
  );
}
