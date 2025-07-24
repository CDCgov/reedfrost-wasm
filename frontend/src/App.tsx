import { pmf, trajectory } from "@wasm/reedfrost";
import { useState } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
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

function PMFChart({
  s0,
  i0,
  prob,
  selectedBars,
  setSelectedBars,
}: {
  s0: number;
  i0: number;
  prob: number;
  selectedBars: number[];
  setSelectedBars: (bars: number[]) => void;
}) {
  function handleHighlightChange(highlighted: { dataIndex?: number } | null) {
    if (highlighted === null || highlighted.dataIndex === undefined) return;

    let value = result[highlighted.dataIndex]?.cum_i_max;
    if (value === undefined) return;

    // If the bar is already selected, remove it from the selection
    if (selectedBars.includes(value)) {
      setSelectedBars(selectedBars.filter((x) => x !== value));
    } else {
      // otherwise, add it
      setSelectedBars([...selectedBars, value]);
    }
  }

  let result: { s_inf: number; cum_i_max: number; pmf: number }[] = [];
  for (let k = 0; k <= s0; k++) {
    result.push({
      s_inf: k,
      // convert from final no. of susceptible to total no. of infections
      cum_i_max: s0 - k + i0,
      pmf: pmf(k, s0, i0, prob),
    });
  }

  result.sort((a, b) => a.cum_i_max - b.cum_i_max);

  return (
    <BarChart
      dataset={result}
      xAxis={[
        {
          label: "Total no. infections",
          dataKey: "cum_i_max",
          // Clicked bars are red; others are default color
          colorMap: {
            type: "ordinal",
            values: selectedBars,
            colors: ["red"],
          },
        },
      ]}
      series={[{ dataKey: "pmf" }]}
      yAxis={[
        {
          label: "Probability",
          domainLimit: (_minValue, _maxValue) => ({ min: 0, max: 1 }),
        },
      ]}
      height={300}
      onHighlightChange={handleHighlightChange}
    />
  );
}

function TrajectoryChart({
  s0,
  i0,
  prob,
  jitter = 0.25,
  finalSizes = [],
}: {
  s0: number;
  i0: number;
  prob: number;
  jitter?: number;
  finalSizes?: number[];
}) {
  let seed = 44;
  let n_trajectories = 100;

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
      data: cumTrajectory.map((x) => x + (Math.random() - 0.5) * jitter),
      curve: "linear",
      showMark: false,
      color: finalSizes.includes(cumTrajectory[cumTrajectory.length - 1])
        ? "red"
        : "black",
    });
  }

  return (
    <LineChart
      series={trajectories}
      slotProps={{ tooltip: { trigger: "none" } }}
      height={500}
    />
  );
}

function Simulation() {
  const [s0, setS0] = useState<number>(10);
  const [i0, setI0] = useState<number>(1);
  const [prob, setProb] = useState<number>(0.1);
  const [selectedBars, setSelectedBars] = useState<number[]>([]);

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
      <PMFChart
        s0={s0}
        i0={i0}
        prob={prob}
        selectedBars={selectedBars}
        setSelectedBars={setSelectedBars}
      />
      <TrajectoryChart s0={s0} i0={i0} prob={prob} finalSizes={selectedBars} />
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
