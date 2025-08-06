import { expect, test } from "vitest";
import {
  jitterTrajectories,
  unpivotTrajectories,
  pivotTrajectories,
  jitter,
  linspace,
} from "@/components/TrajectoryChart";
import _ from "lodash";

test("jitter trajectories with no overlap", () => {
  const trajectories = [[1, 2, 3], [4, 5], [6]];
  expect(jitterTrajectories(trajectories, 0.1)).toEqual(trajectories);
});

test("trajectory dict to arrays", () => {
  const data = [
    { iter: 0, time: 0, value: 0 },
    { iter: 0, time: 1, value: 1 },
    { iter: 0, time: 2, value: 2 },
    { iter: 1, time: 0, value: 0 },
    { iter: 1, time: 1, value: 3 },
    { iter: 2, time: 0, value: 0 },
  ];
  const expected = [[0, 1, 2], [0, 3], [0]];

  expect(unpivotTrajectories(data)).toEqual(expected);
});

test("pivot trajectories", () => {
  const trajectories = [[0, 1, 2], [0, 3], [0]];
  const expected = new Map([
    ["0|0", [0, 1, 2]],
    ["1|1", [0]],
    ["1|3", [1]],
    ["2|2", [0]],
  ]);

  console.log(pivotTrajectories(trajectories));

  expect(pivotTrajectories(trajectories)).toEqual(expected);
});

test("jitter", () => {
  _.zip(jitter(5, 0.1), [-0.2, -0.1, 0.0, 0.1, 0.2]).forEach(([a, b]) => {
    expect(a).toBeCloseTo(b as number, 6);
  });
});

test("linspace", () => {
  expect(linspace(0, 10, 5)).toEqual([0, 2.5, 5, 7.5, 10]);
  expect(linspace(1, 1, 3)).toEqual([1, 1, 1]);
  expect(linspace(0, 0, 0)).toEqual([]);
  expect(linspace(0, 10, -1)).toEqual([]);
});
