import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgSchool = ({ size = 24, color = "currentColor" }: IconProps) => (
	<Svg width={size} height={size} viewBox="0 -960 960 960">
		<Path
			fill={color}
			d="M220-262q-14-8-22.5-21.88Q189-297.75 189-315v-204L89-574q-8-5-12-11.53-4-6.52-4-14.5 0-7.97 4-14.47T89-626l361-198q7-4 14-5.5t15-1.5 15 1.5 14 5.5l396 215q8 5 12 11.97 4 6.96 4 15.03v269q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63-8.5-8.62-8.5-21.37v-252l-91 46v204q0 17.25-8.5 31.12Q752-270 738-262L508-136q-7 4-14 5.5t-15 1.5-15-1.5-14-5.5zm259-166 315-172-315-169-313 169zm0 240 230-127v-168L508-375q-7 4-14 5.5t-15 1.5-14.5-1.5T451-375L249-485v170zm0-150"
		/>
	</Svg>
);
export default SvgSchool;
