import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgVideocam = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 -960 960 960">
    <Path
      fill={color}
      d="M140-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h520q24 0 42 18t18 42v215l134-134q7-7 16.5-3.46T880-649v338q0 9.92-9.5 13.46T854-301L720-435v215q0 24-18 42t-42 18zm0-60h520v-520H140zm0 0v-520z"
    />
  </Svg>
);
export default SvgVideocam;
