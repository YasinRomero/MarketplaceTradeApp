import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgSwapCalls = ({ size = 24, color = "currentColor" }: IconProps) => (
	<Svg width={size} height={size} viewBox="0 -960 960 960">
		<Path
			fill={color}
			d="M200-320v-325q0-65 45-110t110-45 110 45 45 110v289q0 39 28 67t67 28 67-28 28-67v-324l-53 53q-9 9-22 9t-22-9-9-22.5 9-22.5l106-107q5-5 10-7t11-2 11 2 10 7l107 107q9 9 9 22t-9 22-22.5 9-22.5-9l-53-52v324q0 65-45 110t-110 45-110-45-45-110v-289q0-39-28-67t-67-28-67 28-28 67v325l53-53q9-9 22.5-9t22.5 9 9 22.5-9 22.5L251-221q-5 5-10 7t-11 2-11-2-10-7L102-328q-9-9-8.5-22.5T103-373t22.5-9 22.5 9z"
		/>
	</Svg>
);
export default SvgSwapCalls;
