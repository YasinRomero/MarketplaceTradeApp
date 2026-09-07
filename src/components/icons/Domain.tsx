import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgDomain = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 -960 960 960">
    <Path
      fill={color}
      d="M80-180v-600q0-24.75 17.63-42.38Q115.25-840 140-840h270q24.75 0 42.38 17.62Q470-804.75 470-780v105h350q24.75 0 42.38 17.62Q880-639.75 880-615v435q0 24.75-17.62 42.37Q844.75-120 820-120H140q-24.75 0-42.37-17.63Q80-155.25 80-180m60 0h105v-105H140zm0-165h105v-105H140zm0-165h105v-105H140zm0-165h105v-105H140zm165 495h105v-105H305zm0-165h105v-105H305zm0-165h105v-105H305zm0-165h105v-105H305zm165 495h350v-435H470v105h80v60h-80v105h80v60h-80zm185-270v-60h60v60zm0 165v-60h60v60z"
    />
  </Svg>
);
export default SvgDomain;
