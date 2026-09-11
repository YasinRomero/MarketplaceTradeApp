import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgLaptopChromebook = ({ size = 24, color = "currentColor" }: IconProps) => (
	<Svg width={size} height={size} viewBox="0 -960 960 960">
		<Path
			fill={color}
			d="M30-160q-12.75 0-21.37-8.68Q0-177.35 0-190.18 0-203 8.63-211.5 17.25-220 30-220h50v-560q0-24.75 17.63-42.38Q115.25-840 140-840h680q24.75 0 42.38 17.62Q880-804.75 880-780v560h50q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5zm386.59-60h128.82q8.59 0 14.59-6t6-15-6-15-14.59-6H416.59q-8.59 0-14.59 6t-6 15 6 15 14.59 6M144-322h680v-458H144zm340-229"
		/>
	</Svg>
);
export default SvgLaptopChromebook;
