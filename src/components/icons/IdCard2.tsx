import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgIdCard2 = ({ size = 24, color = "currentColor" }: IconProps) => (
	<Svg width={size} height={size} viewBox="0 -960 960 960">
		<Path
			fill={color}
			d="m297-530-33-33q-9-9-21-9t-21 9-9 21.5 9 21.5l55 53q9 9 21 9t21-9l99-99q9-9 9-21t-9-21-21-9-21 9zm-47 210h120q13 0 21.5-8.5T400-350t-8.5-21.5T370-380H250q-13 0-21.5 8.5T220-350t8.5 21.5T250-320m401.5-195.42q21.5-21.42 21.5-51.5t-21.42-51.58-51.5-21.5-51.58 21.42-21.5 51.5 21.42 51.58 51.5 21.5 51.58-21.42M140-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18zm0-60h680v-520H140zm0 0v-520zm460-214q-38 0-66.5 7T483-407q-20 12-31 28.5T441-342q0 9.43 6.68 15.71Q454.35-320 464-320h272q9.65 0 16.32-6.52Q759-333.03 759-343q0-17.69-10.5-34.35Q738-394 718-407q-22-14-51-20.5t-67-6.5"
		/>
	</Svg>
);
export default SvgIdCard2;
