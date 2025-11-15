import * as React from "react";

const LG_BREAKPOINT = 1024;

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
