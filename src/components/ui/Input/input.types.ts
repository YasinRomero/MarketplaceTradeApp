import { ReactNode } from "react";
import { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native";

interface BaseInputWithIconProps extends Omit<TextInputProps, "style"> {
	icon: ReactNode;
	inputStyle?: StyleProp<TextStyle>;
	containerStyle?: StyleProp<ViewStyle>;
}

export interface InputProps extends TextInputProps {
	style?: StyleProp<TextStyle>;
}

export interface InputIconProps extends BaseInputWithIconProps {
	variant?: InputIconVariant;
}

export type InputFilledProps = BaseInputWithIconProps;
export type InputLargeProps = InputProps;
export type InputMiniProps = InputProps;

export type InputIconVariant = "plain" | "normal";
