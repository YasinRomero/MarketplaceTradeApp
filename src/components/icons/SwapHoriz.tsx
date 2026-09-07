import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgSwapHoriz = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 -960 960 960">
    <Path
      fill={color}
      d="m194-323 100 100q9 9 9 21t-9 21-21 9-21-9L101-332q-5-5-7-10t-2-11 2-11 7-10l151-151q9-9 21-9t21 9 9 21-9 21L194-383h286q13 0 21.5 8.5T510-353t-8.5 21.5T480-323zm572-254H480q-13 0-21.5-8.5T450-607t8.5-21.5T480-637h286L666-737q-9-9-9-21t9-21 21-9 21 9l151 151q5 5 7 10t2 11-2 11-7 10L708-435q-9 9-21 9t-21-9-9-21 9-21z"
    />
  </Svg>
);
export default SvgSwapHoriz;
