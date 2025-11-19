import * as React from "react";

const LG_BREAKPOINT = 1024;
const MD_BREAKPOINT = 768;

export function useIsLgScreen() {
	const [isLgScreen, setIsLgScreen] = React.useState<boolean | undefined>(
		undefined,
	);

	React.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${LG_BREAKPOINT - 1}px)`);
		const onChange = () => {
			setIsLgScreen(window.innerWidth < LG_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsLgScreen(window.innerWidth < LG_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return !!isLgScreen;
}

export function useIsMdScreen() {
	const [isMdScreen, setIsMdScreen] = React.useState<boolean | undefined>(
		undefined,
	);

	React.useEffect(() => {
		const mql = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
		const onChange = () => {
			setIsMdScreen(window.innerWidth >= MD_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMdScreen(window.innerWidth >= MD_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return !!isMdScreen;
}
