import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgChevronBackward = ({
  size = 24,
  color = "currentColor",
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 -960 960 960">
    <Path
      fill={color}
      d="m406-481 177 177q9 9 8.5 21t-9.5 21-21.5 9-21.5-9L341-460q-5-5-7-10t-2-11 2-11 7-10l199-199q9-9 21.5-9t21.5 9 9 21.5-9 21.5z"
    />
  </Svg>
);
export default SvgChevronBackward;
