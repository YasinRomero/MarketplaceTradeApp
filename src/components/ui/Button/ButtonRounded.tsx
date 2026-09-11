import { Button } from "./Button";
import { ButtonRoundedProps } from "./button.types";

export function ButtonRounded(props: ButtonRoundedProps) {
	return <Button {...props} style={[{ borderRadius: 999 }, props.style]} />;
}
