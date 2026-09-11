import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./icons.type";
const SvgGavel = ({ size = 24, color = "currentColor" }: IconProps) => (
	<Svg width={size} height={size} viewBox="0 -960 960 960">
		<Path
			fill={color}
			d="M190-180h420q13 0 21.5 8.5T640-150t-8.5 21.5T610-120H190q-13 0-21.5-8.5T160-150t8.5-21.5T190-180m150-194L202-512q-17-17-17.5-41.5T201-596l29-30 224 222-30 30q-17 17-42 17t-42-17m296-212L414-810l30-29q18-17 42.5-16.5T528-838l138 138q17 17 17 42t-17 42zm181 405L302-696l42-42 515 515q9 9 9 21t-9 21-21 9-21-9"
		/>
	</Svg>
);
export default SvgGavel;
