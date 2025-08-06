import { pmf } from "@wasm/reedfrost";
import { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Slider, PercentSlider } from "@/components/Slider";
import { TrajectoryChart } from "@/components/TrajectoryChart";
import "./App.css";

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

  let result: {
    s_inf: number;
    cum_i_max: number;
    pmf: number;
  }[] = [];
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
          colorMap: {
            type: "ordinal",
            colors: result.map((_, i) =>
              highlightedBar === i + 1 ? "red" : "black",
            ),
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

export function App() {
  const [s0, setS0] = useState<number>(10);
  const [i0, setI0] = useState<number>(1);
  const [prob, setProb] = useState<number>(0.1);
  const [highlightedBar, setHighlightedBar] = useState<number | null>(null);

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Parameters</h2>
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
      </div>
      <div className="results">
        <h2>Results</h2>
        <PMFChart
          s0={s0}
          i0={i0}
          prob={prob}
          highlightedBar={highlightedBar}
          setHighlightedBar={setHighlightedBar}
        />
        <TrajectoryChart
          s0={s0}
          i0={i0}
          prob={prob}
          highlight={highlightedBar}
        />
      </div>
    </div>
  );
}
