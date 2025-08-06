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

/**
 * Slider component that allows users to select a value within a specified range.
 *
 * This component distinguishes:
 * - "stored value": the value put into state with setValue
 * - "display value": the value shown in the slider, which is transform(value)
 * - "formatted value": the string value shows for min, max, and current value
 *
 * E.g., a percent slider has a stored value in [0, 1], a display value in [0, 100],
 * and a formatted value like "42%". The transform multiplies by 100, the
 * inverse transform divides by 100.
 *
 * @param {Object} props - properties for the slider
 * @param {string} props.name - displayed above the slider
 * @param {number} props.value - current value
 * @param {function} props.setValue - function to update the value
 * @param {number} props.min - minimum value
 * @param {number} props.max - maximum value
 * @param {number} props.step - step size
 * @param {function} [props.format] - function from value to string for display of
 *   current, min, and max values
 * @param {function} [props.transform] - function from stored value to display value
 * @param {function} [props.inverseTransform] - function from display value to stored value
 */
type SliderProps = {
  name: string;
  value: number | number[];
  setValue: ((value: number) => void) | ((value: number[]) => void);
  min: number;
  max: number;
  step: number;
  format?: (value: number) => string;
  transform?: (value: number) => number;
  inverseTransform?: (value: number) => number;
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
        <span>{lift(format)(value)}</span>
        <span>{format(max)}</span>
      </div>
      <StyledMuiSlider
        value={lift(transform)(value)}
        onChange={(_, newDisplayValue) => {
          const newValue = lift(inverseTransform)(newDisplayValue);
          setValue(newValue);
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

function lift<T>(f: (x: number) => T): (x: number | number[]) => T | T[] {
  return (x) => {
    if (Array.isArray(x)) {
      return x.map(f);
    } else {
      return f(x);
    }
  };
}
