import { run } from "@wasm/reedfrost";
import { useState } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";

type MySliderProps = {
  name: string;
  value: number;
  setterFunc: (value: number) => void;
  min: number;
  max: number;
  step: number;
};

function MySlider({ name, value, setterFunc, min, max, step }: MySliderProps) {
  return (
    <Box>
      {name}
      <Grid container spacing={2}>
        <Grid size="grow">
          <Slider
            value={value}
            onChange={(_, newValue) => setterFunc(newValue)}
            min={min}
            max={max}
            step={step}
          />
        </Grid>
        <Grid>{value}</Grid>
      </Grid>
    </Box>
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
    let newResult = [];
    for (let k = 0; k <= s0; k++) {
      newResult.push(run(k, s0, i0, prob));
    }
    setResult(newResult);
  }

  function resetClick() {
    setResult(null);
  }

  return (
    <>
      <MySlider
        name="Probability"
        value={prob}
        setterFunc={setProb}
        min={0.0}
        max={1.0}
        step={0.01}
      />
      <MySlider
        name="Initial S"
        value={s0}
        setterFunc={setS0}
        min={1}
        max={50}
        step={1}
      />
      <MySlider
        name="Initial I"
        value={i0}
        setterFunc={setI0}
        min={1}
        max={10}
        step={1}
      />
      <Button variant="outlined" onClick={runClick}>
        Run simulation
      </Button>
      <Button variant="outlined" onClick={resetClick}>
        Reset
      </Button>
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
