import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgChevronForward = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 -960 960 960">
    <Path
      fill={color}
      d="M530-481 353-658q-9-9-8.5-21t9.5-21 21.5-9 21.5 9l198 198q5 5 7 10t2 11-2 11-7 10L396-261q-9 9-21 8.5t-21-9.5-9-21.5 9-21.5z"
    />
  </Svg>
);
export default SvgChevronForward;
