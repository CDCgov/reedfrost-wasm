import { LineChart } from "@mui/x-charts/LineChart";
import { trajectory } from "@wasm/reedfrost";
import type { LineSeriesType } from "@mui/x-charts";

export function TrajectoryChart({
  s0,
  i0,
  prob,
  highlight,
}: {
  s0: number;
  i0: number;
  prob: number;

  highlight: number | null;
}) {
  const trajectories = sampleTrajectories(s0, i0, prob);
  const series: LineSeriesType[] = trajectories.map((trajectory) => ({
    data: trajectory.data,
    type: "line",
    curve: "linear",
    showMark: false,
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

function sampleTrajectories(
  s0: number,
  i0: number,
  prob: number,
  jitter: number = 0.25,
): { raw_data: number[]; data: number[] }[] {
  let seed = 44;
  let n_trajectories = 100;

  let jitter_seed = 44;

  function jittered(x: number): number {
    var y = Math.PI * (x ^ jitter_seed++);
    y -= Math.floor(y);
    return x + (y - 0.5) * jitter;
  }

  let trajectories = [];
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
    });
  }

  return trajectories;
}
