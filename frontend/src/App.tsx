import { run } from "@wasm/reedfrost";
import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
// some of these have brackets, and some not. How predictable is that?
// It has something to do with import paths
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";

type MySliderProps = {
  name: string;
  value: number;
  setterFunc: (value: number) => void;
  min: number;
  max: number;
  step: number;
  valueFormatter?: (value: number) => string;
  callback?: () => void;
};

// This feels like a component?
function MySlider({
  name,
  value,
  setterFunc,
  min,
  max,
  step,
  valueFormatter = (x) => x.toString(),
  callback = () => {},
}: MySliderProps) {
  return (
    <Box>
      <Typography id={`${name}-slider`}>{name}</Typography>
      <Grid container spacing={2}>
        <Grid size="grow">
          <Slider
            aria-labelledby={`${name}-slider`}
            value={value}
            onChange={(_, newValue) => {
              setterFunc(newValue);
              callback();
            }}
            min={min}
            max={max}
            step={step}
            getAriaValueText={valueFormatter}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid>{value}</Grid>
      </Grid>
    </Box>
  );
}

// Is this idiomatic? To make a derived/child component, like a subclass?
type PercentSliderProps = {
  name: string;
  value: number;
  setterFunc: (value: number) => void;
  callback?: () => void;
};

function PercentSlider({
  name,
  value,
  setterFunc,
  callback,
}: PercentSliderProps) {
  return (
    <MySlider
      name={name}
      value={value}
      setterFunc={setterFunc}
      min={0.0}
      max={1.0}
      step={0.01}
      // This doesn't work like I expect
      valueFormatter={(x) => `${x * 100}%`}
      callback={callback}
    />
  );
}

// This likely isn't a "component," but it is some kind of view field?
function renderResult(result: object[] | null) {
  if (result === null) {
    return <>No result</>;
  } else {
    return (
      <>
        <BarChart
          xAxis={[
            {
              label: "Final no. susceptibles",
              data: result.map((r) => (r as any).k),
            },
          ]}
          series={[{ data: result.map((r) => (r as any).pmf) }]}
          height={300}
          yAxis={[{ label: "Probability" }]}
        />
      </>
    );
  }
}

// Is this a "component"? Something bigger?
function simShower() {
  const [result, setResult] = useState<object[] | null>(null);
  const [s0, setS0] = useState<number>(10);
  const [i0, setI0] = useState<number>(1);
  const [prob, setProb] = useState<number>(0.1);

  // Run simulations with the current parameters
  function runResult() {
    let newResult = [];
    for (let k = 0; k <= s0; k++) {
      newResult.push({ k: k, pmf: run(k, s0, i0, prob) });
    }
    setResult(newResult);
  }

  // Run the simulation when the component mounts
  useEffect(() => {
    runResult();
  }, []);

  return (
    <>
      <Typography variant="h2">Parameters</Typography>
      <PercentSlider
        name="Probability"
        value={prob}
        setterFunc={setProb}
        // This hangs/crashes?
        // callback={runResult}
      />
      <MySlider
        name="Initial S"
        value={s0}
        setterFunc={setS0}
        min={1}
        max={50}
        step={1}
        // callback={runResult}
      />
      <MySlider
        name="Initial I"
        value={i0}
        setterFunc={setI0}
        min={1}
        max={10}
        step={1}
        // callback={runResult}
      />
      <Button variant="contained" onClick={runResult}>
        Run simulation
      </Button>
      <Typography variant="h2">Result</Typography>
      {renderResult(result)}
    </>
  );
}

export function App() {
  return (
    <>
      <Typography variant="h1">Simulation</Typography>
      {simShower()}
      <Typography variant="body1">End of app</Typography>
    </>
  );
}
