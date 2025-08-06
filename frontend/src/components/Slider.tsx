import MuiSlider from "@mui/material/Slider";
import styled from "@emotion/styled";
import { alpha } from "@mui/material";
import "./Slider.css";

const BLUE = "rgb(0, 0, 255)";
const THUMB_RADIUS = 20;

const StyledMuiSlider = styled(MuiSlider)({
  color: BLUE,
  "& .MuiSlider-thumb": {
    width: THUMB_RADIUS,
    height: THUMB_RADIUS,
    "&:hover, &.Mui-focusVisible": {
      boxShadow: `0px 0px 0px 5px ${alpha(BLUE, 0.25)}`,
    },
    "&.Mui-active": {
      boxShadow: `0px 0px 0px 10px ${alpha(BLUE, 0.25)}`,
    },
  },
  "& .MuiSlider-rail": {
    backgroundColor: BLUE,
    opacity: 0.5,
  },
  "& .MuiSlider-track": {
    backgroundColor: BLUE,
    height: 6,
  },
});

type SliderProps = {
  name: string;
  value: number;
  setValue: (value: number | number[]) => void;
  min: number;
  max: number;
  step: number;
  format?: (value: number | number[]) => string;
  transform?: (value: number | number[]) => number | number[];
  inverseTransform?: (value: number | number[]) => number | number[];
};

export function Slider({
  name,
  value,
  setValue,
  min,
  max,
  step,
  format = (x) => x.toString(),
  transform = (x) => x,
  inverseTransform = (x) => x,
}: SliderProps) {
  return (
    <div className="slider-container">
      <b>{name}</b>
      <div
        className="range-info"
        style={{
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{format(min)}</span>
        <span>{format(value)}</span>
        <span>{format(max)}</span>
      </div>
      <StyledMuiSlider
        value={transform(value)}
        onChange={(_, newValue) => {
          setValue(inverseTransform(newValue));
        }}
        min={transform(min)}
        max={transform(max)}
        step={transform(step)}
        valueLabelDisplay="off"
      />
    </div>
  );
}

type PercentSliderProps = Omit<
  SliderProps,
  "min" | "max" | "step" | "transform" | "inverseTransform" | "format"
>;

export function PercentSlider(props: PercentSliderProps) {
  return (
    <Slider
      {...props}
      min={0.0}
      max={1.0}
      step={0.01}
      transform={(x) => x * 100}
      inverseTransform={(x) => x / 100}
      format={(x) => `${Math.round(x * 100)}%`}
    />
  );
}
