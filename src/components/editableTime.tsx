import { CSSProperties, useEffect, useState } from "react";
import useComponentVisible from "src/youtube/useComponentVisible";

const twoDigits = (num: number) => String(num).padStart(2, "0");
export const clamp = (val: number, min: number, max: number) => {
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
    // If component was closed, update the timer
    if (!isComponentVisible) {
      let newMins = clamp(minutes, 0, 99);
      let newSecs = clamp(seconds, 0, 59);
      onSubmit(newMins * 60 + newSecs);
    } else {
      // If component was recently opened to editing mode, make sure up to date
      setMinutes(minutesToDisplay);
      setSeconds(secondsToDisplay);
    }
  }, [isComponentVisible]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <form
          className="font-mono text-8xl bg-gray-200 text-black text-center
        flex flex-row place-content-center"
          onSubmit={(e) => {
            setIsComponentVisible(false);
            e.preventDefault();
          }}
        >
          <input
            type="number"
            min={0}
            max={99}
            step={1}
            className="input text-8xl h-full w-1/2 bg-inherit text-right"
            name="minutes"
            defaultValue={twoDigits(minutesToDisplay)}
            onChange={(e) => {
              if (e.target.checkValidity()) setMinutes(e.target.valueAsNumber);
            }}
          />
          :
          <input
            type="number"
            min={0}
            max={59}
            step={1}
            className="text-8xl w-1/2 bg-inherit"
            name="seconds"
            defaultValue={twoDigits(secondsToDisplay)}
            onChange={(e) => {
              if (e.target.checkValidity()) setSeconds(e.target.valueAsNumber);
            }}
          />
          <button type="submit" className="hidden" />
        </form>
      )}
    </div>
  );
}
