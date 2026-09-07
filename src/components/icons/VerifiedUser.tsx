import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgVerifiedUser = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 -960 960 960">
    <Path
      fill={color}
      d="m439-433-79-79q-9-9-22-9t-22 9-9 21.83q0 12.84 9 22.17l99 100q9 9 21 9t21-9l186-186q9-9.07 9-21.53 0-12.47-8.5-20.47t-21.5-7.5-21 8.5zm31.12 348q-4.56-1-9.12-3-139-47-220-168.5t-81-266.61V-719q0-19.26 10.88-34.66Q181.75-769.07 199-776l260-97q11-4 21-4t21 4l260 97q17.25 6.93 28.13 22.34Q800-738.26 800-719v195.89Q800-378 719-256.5T499-88q-4.56 2-9.12 3T480-84t-9.88-1m9.88-58q115-38 187.5-143.5T740-523v-196l-260-98-260 98v196q0 131 72.5 236.5T480-143m0-337"
    />
  </Svg>
);
export default SvgVerifiedUser;
