import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgClose = ({ size = 24, color = "currentColor" }: IconProps) => (
	<Svg width={size} height={size} viewBox="0 -960 960 960">
		<Path
			fill={color}
			d="M480-438 270-228q-9 9-21 9t-21-9-9-21 9-21l210-210-210-210q-9-9-9-21t9-21 21-9 21 9l210 210 210-210q9-9 21-9t21 9 9 21-9 21L522-480l210 210q9 9 9 21t-9 21-21 9-21-9z"
		/>
	</Svg>
);
export default SvgClose;
