import { primitives } from "./primitives";

export const colors = {
	text: {
		primary: primitives.black,
		secondary: primitives.neutral[600],
		muted: primitives.neutral[500],
		inverse: primitives.white,
	},

	background: {
		page: primitives.neutral[100],
		surface: primitives.white,
		subtle: primitives.neutral[200],
	},

	border: {
		default: primitives.neutral[300],
	},

	action: {
		primary: primitives.highlight.base,
		primaryHover: primitives.highlight.hover,
		primaryActive: primitives.highlight.active,
		primaryForeground: primitives.white,

		secondary: primitives.white,
		secondaryHover: primitives.neutral[100],
		secondaryActive: primitives.neutral[200],
		secondaryForeground: primitives.black,
		secondaryBorder: primitives.neutral[300],

		ghostHover: primitives.neutral[100],
		ghostActive: primitives.neutral[200],
		ghostForeground: primitives.neutral[600],
	},

	card: {
		yellow: {
			foreground: primitives.yellow.main,
			background: primitives.yellow.background,
			transparent: primitives.yellow.transparent,
		},

		pink: {
			foreground: primitives.pink.main,
			background: primitives.pink.background,
			transparent: primitives.pink.transparent,
		},

		orange: {
			foreground: primitives.orange.main,
			background: primitives.orange.background,
			transparent: primitives.orange.transparent,
		},

		red: {
			foreground: primitives.red.main,
			background: primitives.red.background,
			transparent: primitives.red.transparent,
		},

		green: {
			foreground: primitives.green.main,
			background: primitives.green.background,
			transparent: primitives.green.transparent,
		},

		cyan: {
			foreground: primitives.cyan.main,
			background: primitives.cyan.background,
			transparent: primitives.cyan.transparent,
		},

		blue: {
			foreground: primitives.blue.main,
			background: primitives.blue.background,
			transparent: primitives.blue.transparent,
		},

		purple: {
			foreground: primitives.purple.main,
			background: primitives.purple.background,
			transparent: primitives.purple.transparent,
		},
	},
} as const;

export const boxShadows = {
	default: "0px 1px 2px rgba(0, 0, 0, 0.05)",
};
