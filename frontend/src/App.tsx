import { run } from "@wasm/reedfrost";
import { useState } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
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
};

function MySlider({
  name,
  value,
  setterFunc,
  min,
  max,
  step,
  valueFormatter = (x) => x.toString(),
}: MySliderProps) {
  return (
    <Box>
      <Typography id={`${name}-slider`}>{name}</Typography>
      <Grid container spacing={2}>
        <Grid size="grow">
          <Slider
            aria-labelledby={`${name}-slider`}
            value={value}
            onChange={(_, newValue) => setterFunc(newValue)}
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

type PercentSliderProps = {
  name: string;
  value: number;
  setterFunc: (value: number) => void;
};

function PercentSlider({ name, value, setterFunc }: PercentSliderProps) {
  return (
    <MySlider
      name={name}
      value={value}
      setterFunc={setterFunc}
      min={0.0}
      max={1.0}
      step={0.01}
      valueFormatter={(x) => `${x * 100}%`}
    />
  );
}

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

function simShower() {
  const [result, setResult] = useState<object[] | null>(null);
  const [s0, setS0] = useState<number>(10);
  const [i0, setI0] = useState<number>(1);
  const [prob, setProb] = useState<number>(0.1);

  function runClick() {
    let newResult = [];
    for (let k = 0; k <= s0; k++) {
      newResult.push({ k: k, pmf: run(k, s0, i0, prob) });
    }
    setResult(newResult);
  }

  function resetClick() {
    setResult(null);
  }

  return (
    <>
      <Typography variant="h2">Parameters</Typography>
      <PercentSlider name="Probability" value={prob} setterFunc={setProb} />
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
