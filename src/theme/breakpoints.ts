export const breakpoints = {
	sm: 480,
	lg: 1024,
} as const;

export const responsive = {
	isMobile: (width: number) => width < breakpoints.sm,
	isTablet: (width: number) => width >= breakpoints.sm && width < breakpoints.lg,
	isDesktop: (width: number) => width >= breakpoints.lg,

	isTabletDown: (width: number) => width < breakpoints.lg,
	isMobileDown: (width: number) => width < breakpoints.sm,

	isTabletUp: (width: number) => width >= breakpoints.sm,
	isDesktopUp: (width: number) => width >= breakpoints.lg,
} as const;
