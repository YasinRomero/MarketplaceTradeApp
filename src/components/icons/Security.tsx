import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgSecurity = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 -960 960 960">
    <Path
      fill={color}
      d="M480-142q106-35 175.5-128.5T737-480H480v-335l-260 97v196q0 12 .5 20.5T223-480h257zm-9.5 57q-4.5-1-9.5-3-139-47-220-168.5T160-523v-196q0-19 11-34.5t28-22.5l260-97q11-4 21-4t21 4l260 97q17 7 28 22.5t11 34.5v196q0 145-81 266.5T499-88q-5 2-9.5 3t-9.5 1-9.5-1"
    />
  </Svg>
);
export default SvgSecurity;
