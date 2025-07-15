import { pmf, trajectory } from "@wasm/reedfrost";
import { useState } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import type { BarItemIdentifier } from "@mui/x-charts";
import { LineChart } from "@mui/x-charts/LineChart";

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
            onChange={(_, newValue) => {
              setterFunc(newValue);
            }}
            min={min}
            max={max}
            step={step}
            getAriaValueText={valueFormatter}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid>{valueFormatter(value)}</Grid>
      </Grid>
    </Box>
  );
}

type PercentSliderProps = Omit<
  MySliderProps,
  "min" | "max" | "step" | "valueFormatter"
>;

function PercentSlider(props: PercentSliderProps) {
  return (
    <MySlider
      {...props}
      min={0.0}
      max={1.0}
      step={0.01}
      valueFormatter={(x) => `${x * 100}%`}
    />
  );
}

function PMFChart({ s0, i0, prob }: { s0: number; i0: number; prob: number }) {
  // Track which bars are clicked on. Change their color.
  const [selectedBars, setSelectedBars] = useState<number[]>([]);

  function barClickHander(_event: React.MouseEvent, barID: BarItemIdentifier) {
    // If the bar is already selected, remove it from the selection
    if (selectedBars.includes(barID.dataIndex)) {
      setSelectedBars(selectedBars.filter((id) => id !== barID.dataIndex));
    } else {
      // otherwise, add it
      setSelectedBars([...selectedBars, barID.dataIndex]);
    }
  }

  let result = [];
  for (let k = 0; k <= s0; k++) {
    result.push({
      k: k,
      pmf: pmf(k, s0, i0, prob),
    });
  }

  return (
    <BarChart
      dataset={result}
      xAxis={[
        {
          label: "Final no. susceptibles",
          dataKey: "k",
          // Clicked bars are red; others are default color
          colorMap: {
            type: "ordinal",
            values: selectedBars,
            colors: ["red"],
          },
        },
      ]}
      series={[{ dataKey: "pmf" }]}
      yAxis={[{ label: "Probability" }]}
      height={300}
      onItemClick={barClickHander}
    />
  );
}

function TrajectoryChart({
  s0,
  i0,
  prob,
}: {
  s0: number;
  i0: number;
  prob: number;
}) {
  let seed = 44;
  let n_trajectories = 10;

  let trajectories: object[] = [];
  for (let i = 0; i < n_trajectories; i++) {
    seed += 1;
    let incidentTrajectory = Array.from(trajectory(s0, i0, prob, seed));

    let x = 0;
    let cumTrajectory = incidentTrajectory.map((y) => {
      x += y;
      return x;
    });

    trajectories.push({
      data: cumTrajectory,
      curve: "step",
    });
  }

  return <LineChart series={trajectories} />;
}

function Simulation() {
  const [s0, setS0] = useState<number>(10);
  const [i0, setI0] = useState<number>(1);
  const [prob, setProb] = useState<number>(0.1);

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
      <Typography variant="h2">Result</Typography>
      <PMFChart s0={s0} i0={i0} prob={prob} />
      <TrajectoryChart s0={s0} i0={i0} prob={prob} />
    </>
  );
}

export function App() {
  return (
    <>
      <Typography variant="h1">Simulation</Typography>
      <Simulation />
      <Typography variant="body1">End of app</Typography>
    </>
  );
}
