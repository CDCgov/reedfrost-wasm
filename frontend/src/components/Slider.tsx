import MuiSlider from "@mui/material/Slider";
import styled from "@emotion/styled";
import { alpha } from "@mui/material";

let BLUE = "rgb(0, 0, 255)";

type SliderProps = {
  name: string;
  value: number;
  setterFunc: (value: number) => void;
  min: number;
  max: number;
  step: number;
  valueAdjuster?: (value: number | number[]) => number;
  valueFormatter?: (value: number) => string;
};

const StyledMuiSlider = styled(MuiSlider)({
  color: BLUE,
  "& .MuiSlider-thumb": {
    "&:hover, &.Mui-focusVisible": {
      boxShadow: `0px 0px 0px 5px ${alpha(BLUE, 0.16)}`,
    },
    "&.Mui-active": {
      boxShadow: `0px 0px 0px 10px ${alpha(BLUE, 0.16)}`,
    },
    "& .MuiSlider-valueLabel": {
      backgroundColor: "white",
      color: "black",
    },
  },
});

export function Slider({
  name,
  value,
  setterFunc,
  min,
  max,
  step,
  valueFormatter = (x) => x.toString(),
}: SliderProps) {
  return (
    <div>
      {name}
      <StyledMuiSlider
        aria-labelledby={`${name}-slider`}
        value={value}
        onChange={(_, newValue) => {
          setterFunc(newValue);
        }}
        min={min}
        max={max}
        step={step}
        getAriaValueText={valueFormatter}
        valueLabelDisplay="on"
      />
      {valueFormatter(value)}
      <div
        className="range-info"
        style={{
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{valueFormatter(min)}</span>
        <span>{valueFormatter(max)}</span>
      </div>
    </div>
  );
}

type PercentSliderProps = Omit<
  SliderProps,
  "min" | "max" | "step" | "valueFormatter"
>;

export function PercentSlider(props: PercentSliderProps) {
  return (
    <Slider
      {...props}
      min={0}
      max={100}
      step={1}
      valueFormatter={(x) => `${x}%`}
    />
  );
}
