import { pmf, trajectory } from "@wasm/reedfrost";
import { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { Slider, PercentSlider } from "./components/Slider";
import Typography from "@mui/material/Typography";

function PMFChart({
  s0,
  i0,
  prob,
  highlightedBar,
  setHighlightedBar,
}: {
  s0: number;
  i0: number;
  prob: number;
  highlightedBar: number | null;
  setHighlightedBar: (bar: number | null) => void;
}) {
  function handleHighlightChange(highlighted: { dataIndex?: number } | null) {
    if (highlighted === null || highlighted.dataIndex === undefined) {
      setHighlightedBar(null);
      return;
    }

    let value = result[highlighted.dataIndex]?.cum_i_max;
    if (value === undefined) {
      setHighlightedBar(null);
      return;
    }

    setHighlightedBar(value);
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
          // Highlighted bar is red; others are default color
          colorMap: {
            type: "ordinal",
            values: highlightedBar !== null ? [highlightedBar] : [],
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
  trajectories,
  highlight,
}: {
  trajectories: any[];
  highlight: number | null;
}) {
  const series = trajectories.map((trajectory) => ({
    ...trajectory,
    color:
      highlight !== null &&
      trajectory.raw_data[trajectory.raw_data.length - 1] === highlight
        ? "red"
        : "black",
  }));

  return (
    <LineChart
      series={series}
      slotProps={{ tooltip: { trigger: "none" } }}
      height={500}
    />
  );
}

function drawTrajectories(
  s0: number,
  i0: number,
  prob: number,
  jitter: number = 0.25,
): object[] {
  let seed = 44;
  let n_trajectories = 100;

  let jitter_seed = 44;

  function jittered(x: number): number {
    var y = Math.PI * (x ^ jitter_seed++);
    y -= Math.floor(y);
    return x + (y - 0.5) * jitter;
  }

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
      raw_data: cumTrajectory,
      data: cumTrajectory.map((x) => jittered(x)),
      curve: "linear",
      showMark: false,
    });
  }

  return trajectories;
}

function Simulation() {
  const [s0, setS0] = useState<number>(10);
  const [i0, setI0] = useState<number>(1);
  const [prob, setProb] = useState<number>(0.1);
  const [highlightedBar, setHighlightedBar] = useState<number | null>(null);

  const trajectories = drawTrajectories(s0, i0, prob);

  return (
    <>
      <Typography variant="h2">Parameters</Typography>
      <PercentSlider name="Probability" value={prob} setValue={setProb} />
      <Slider
        name="Initial S"
        value={s0}
        setValue={setS0}
        min={1}
        max={50}
        step={1}
      />
      <Slider
        name="Initial I"
        value={i0}
        setValue={setI0}
        min={1}
        max={10}
        step={1}
      />
      <Typography variant="h2">Result</Typography>
      <PMFChart
        s0={s0}
        i0={i0}
        prob={prob}
        highlightedBar={highlightedBar}
        setHighlightedBar={setHighlightedBar}
      />
      <TrajectoryChart trajectories={trajectories} highlight={highlightedBar} />
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
