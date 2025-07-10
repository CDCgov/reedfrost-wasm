import { run } from "@wasm/reedfrost";
import { useState } from "react";
import Slider from "@mui/material/Slider";

function mySlider(
  name: string,
  oldValue: number,
  setterFunc: (value: number) => void,
  min: number,
  max: number,
  step: number,
) {
  const handleChange = (_: Event, value: number) => {
    setterFunc(value);
  };

  return (
    <>
      <Slider
        value={oldValue}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
      />
      <div>
        {name}: {oldValue}
      </div>
    </>
  );
}

function renderResult(result: number[] | null) {
  if (result === null) {
    return <>No result</>;
  } else {
    return (
      <>
        {result.map((element, index) => (
          <p key={index}>
            {index}: {element}
          </p>
        ))}
      </>
    );
  }
}

function simShower() {
  let [result, setResult] = useState<number[] | null>(null);
  const [s0, setS0] = useState<number>(10);
  const [i0, setI0] = useState<number>(1);
  const [prob, setProb] = useState<number>(0.1);

  function runClick() {
    let result = new Array();
    for (let k = 0; k <= s0; k++) {
      result.push(run(k, s0, i0, prob));
    }
    setResult(result);
  }

  function resetClick() {
    setResult(null);
  }

  return (
    <>
      {mySlider("Probability", prob, setProb, 0.0, 1.0, 0.01)}
      {mySlider("Initial S", s0, setS0, 1, 50, 1)}
      {mySlider("Initial I", i0, setI0, 1, 10, 1)}
      <button onClick={runClick}>Run simulation</button>
      <button onClick={resetClick}>Reset</button>
      <h2>Result</h2>
      {renderResult(result)}
    </>
  );
}

export function App() {
  return (
    <>
      <h1>Simulation</h1>
      {simShower()}
      <h1>End of app</h1>
    </>
  );
}
