import { ComponentProps } from "react";
import { Button } from "./Button";

type ButtonRoundedProps = ComponentProps<typeof Button>;

export function ButtonRounded(props: ButtonRoundedProps) {
  return (
    <Button
      {...props}
      style={[
        {
          borderRadius: 999,
        },
        props.style,
      ]}
    />
  );
}
