import { LineChart } from "@mui/x-charts/LineChart";
import { trajectory } from "@wasm/reedfrost";
import type { LineSeriesType } from "@mui/x-charts";
import _, { isUndefined, times, values } from "lodash";

export function TrajectoryChart({
  s0,
  i0,
  prob,
  highlight,
  jitterSize = 0.8,
}: {
  s0: number;
  i0: number;
  prob: number;
  highlight: number | null;
  jitterSize?: number;
}) {
  const trajectories = sampleTrajectories(s0, i0, prob);
  const trajectoriesWithJitter = jitterTrajectories(trajectories, jitterSize);
  const series: LineSeriesType[] = _.zip(
    trajectories,
    trajectoriesWithJitter,
  ).map(([traj, jitterTraj]) => ({
    data: jitterTraj,
    type: "line",
    curve: "linear",
    showMark: false,
    color:
      highlight !== null &&
      !isUndefined(traj) &&
      traj[traj.length - 1] === highlight
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
  seed: number = 42,
): number[][] {
  let n_trajectories = 100;

  let trajectories = [];
  for (let i = 0; i < n_trajectories; i++) {
    seed += 1;
    let incidentTrajectory = Array.from(trajectory(s0, i0, prob, seed));

    let x = 0;
    let cumTrajectory = incidentTrajectory.map((y) => {
      x += y;
      return x;
    });

    trajectories.push(cumTrajectory);
  }

  return trajectories;
}

export function jitterTrajectories(
  trajectories: number[][],
  jitterRange: number = 0.8,
): number[][] {
  if (jitterRange < 0.0) {
    throw new Error("Jitter range must be non-negative");
  }

  // Transform to data[{time, value}] = [iter, iter, ...]
  const data = pivotTrajectories(trajectories);

  // What is the maximum number of points at any time/value?
  const maxCounts = _.max([...data.values()].map((iters) => iters.length)) || 1;
  const space = jitterRange / maxCounts;

  // Create jittered [{time, value, iter}]
  var jvti: { iter: number; value: number; time: number }[] = [];
  data.forEach((iters, key) => {
    const [time, value] = keyToNumbers(key);
    const jitters = jitter(iters.length, space);
    // Zip together iter and jitter
    jvti.push(
      ..._.zip(_.sortBy(iters), jitters).map(([iter, j]) => ({
        iter: iter as number,
        time,
        value: value + (j as number),
      })),
    );
  });

  // Return to original format
  return unpivotTrajectories(jvti);
}

export function unpivotTrajectories(
  data: { time: number; value: number; iter: number }[],
): number[][] {
  const out: number[][] = [];
  var thisIter = 0;
  var thisTime = 0;
  var thisTraj: number[] = [];

  _.sortBy(data, ["iter", "time"]).forEach(({ time, value, iter }) => {
    if (iter === thisIter && time === thisTime) {
      thisTraj.push(value);
      thisTime += 1;
    } else if (iter === thisIter + 1 && time === 0) {
      out.push(thisTraj);
      thisTraj = [value];
      thisIter = iter;
      thisTime = 1;
    } else {
      throw new Error("Data is not well-formed");
    }
  });

  out.push(thisTraj);

  return out;
}

// Transform to [[iter1_time1, iter1_time2], [iter2_time1, iter2_time2, ...], ...] to
// data[time_value key] = [iter, iter, ...]
export function pivotTrajectories(
  trajectories: number[][],
): Map<string, number[]> {
  const data = new Map();
  trajectories.forEach((trajectory, iter) => {
    trajectory.forEach((value, time) => {
      const key = numbersToKey([time, value]);
      const iters = data.get(key);
      if (isUndefined(iters)) {
        data.set(key, [iter]);
      } else {
        data.set(key, [...iters, iter]);
      }
    });
  });

  return data;
}

export function numbersToKey(x: number[]): string {
  return x.map((v) => v.toString()).join("|");
}

export function keyToNumbers(key: string): number[] {
  return key.split("|").map((v) => parseFloat(v));
}

// Deterministic jitter for n points with space in between them
export function jitter(n: number, space: number): number[] {
  const half_width = (space * (n - 1)) / 2;
  return linspace(-half_width, half_width, n);
}

export function linspace(start: number, stop: number, num: number): number[] {
  if (num <= 0) {
    return [];
  }
  if (num === 1) {
    return [start];
  }

  const step = (stop - start) / (num - 1);
  const result = [];
  for (let i = 0; i < num; i++) {
    result.push(start + i * step);
  }
  return result;
}
