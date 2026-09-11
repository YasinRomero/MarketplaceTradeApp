import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgKeyboardArrowDown = ({ size = 24, color = "currentColor" }: IconProps) => (
	<Svg width={size} height={size} viewBox="0 -960 960 960">
		<Path
			fill={color}
			d="M469-358q-5-2-10-7L261-563q-9-9-8.5-21.5T262-606t21.5-9 21.5 9l175 176 176-176q9-9 21-8.5t21 9.5 9 21.5-9 21.5L501-365q-5 5-10 7t-11 2-11-2"
		/>
	</Svg>
);
export default SvgKeyboardArrowDown;
