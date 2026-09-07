import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgPhotoCamera = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 -960 960 960">
    <Path
      fill={color}
      d="M479.5-267q72.5 0 121.5-49t49-121.5-49-121T479.5-607t-121 48.5-48.5 121T358.5-316t121 49m0-60q-47.5 0-78.5-31.5t-31-79 31-78.5 78.5-31 79 31 31.5 78.5-31.5 79-79 31.5M140-120q-24 0-42-18t-18-42v-513q0-23 18-41.5t42-18.5h147l55-66q8-11 20-16t26-5h184q14 0 26 5t20 16l55 66h147q23 0 41.5 18.5T880-693v513q0 24-18.5 42T820-120zm0-60h680v-513H645l-73-87H388l-73 87H140zm340-257"
    />
  </Svg>
);
export default SvgPhotoCamera;
