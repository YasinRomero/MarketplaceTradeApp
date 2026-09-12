import { View } from "react-native";

export default function MicrosoftLogo() {
	const squares = [
		{ color: "#F25022", position: "topLeft" as const },
		{ color: "#7FBA00", position: "topRight" as const },
		{ color: "#00A4EF", position: "bottomLeft" as const },
		{ color: "#FFB900", position: "bottomRight" as const },
	];

	const microsoftPositions = {
		topLeft: { top: 0, left: 0 },
		topRight: { top: 0, right: 0 },
		bottomLeft: { bottom: 0, left: 0 },
		bottomRight: { bottom: 0, right: 0 },
	};

	return (
		<View
			style={{
				width: 20,
				height: 20,
				position: "relative",
			}}
		>
			{squares.map(({ color, position }) => (
				<View
					key={position}
					style={[
						{
							position: "absolute",
							width: 9,
							height: 9,
							backgroundColor: color,
						},
						microsoftPositions[position],
					]}
				/>
			))}
		</View>
	);
}
