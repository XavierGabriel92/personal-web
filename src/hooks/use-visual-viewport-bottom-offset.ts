import * as React from "react";

/**
 * Extra pixels to nudge `position: fixed; bottom: 0` elements downward so they
 * stay flush with the visible screen when iOS Safari’s layout and visual
 * viewports diverge (e.g. bottom toolbar hiding on scroll).
 */
export function useVisualViewportBottomOffset(): number {
	const [offsetPx, setOffsetPx] = React.useState(0);

	React.useEffect(() => {
		const vv = window.visualViewport;
		if (!vv) {
			return;
		}

		const update = () => {
			const gap = window.innerHeight - vv.height - vv.offsetTop;
			setOffsetPx(Number.isFinite(gap) ? Math.max(0, gap) : 0);
		};

		update();
		vv.addEventListener("resize", update);
		vv.addEventListener("scroll", update);
		window.addEventListener("resize", update);

		return () => {
			vv.removeEventListener("resize", update);
			vv.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, []);

	return offsetPx;
}
