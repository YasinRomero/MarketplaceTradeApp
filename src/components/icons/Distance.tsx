import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgDistance = ({ size = 24, color = "currentColor" }: IconProps) => (
	<Svg width={size} height={size} viewBox="0 -960 960 960">
		<Path
			fill={color}
			d="M480-80q-106 0-173-31t-67-79q0-22 15.5-41.5T300-266q11-5 22.5-2t16.5 14 2 22.5-14 16.5q-8 6-15 12.5T299-190q17 20 70.5 35T480-140t110.5-15 70.5-35q-6-6-13-12.5T633-215q-11-5-14-16.5t2-22.5 16.5-14 22.5 2q29 15 44.5 34.5T720-190q0 48-67 79T480-80m1-195q109-81 164-164t55-155q0-112-71-169t-149-57q-77 0-148.5 57T260-594q0 73 55 152t166 167m-19 58q-9-3-17-9-123-97-184-188.5T200-594q0-71 25.5-124.5t66-89.5 90-54 98.5-18 99 18 90 54 65.5 89.5T760-594q0 88-61 179.5T514-226q-8 6-16.5 9t-17.5 3-18-3m18-303q33 0 56.5-23.5T560-600t-23.5-56.5T480-680t-56.5 23.5T400-600t23.5 56.5T480-520m0-80"
		/>
	</Svg>
);
export default SvgDistance;
