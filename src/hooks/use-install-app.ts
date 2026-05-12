import * as React from "react";

type InstallPromptOutcome = "accepted" | "dismissed";

type BeforeInstallPromptEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{
		outcome: InstallPromptOutcome;
		platform: string;
	}>;
};

type InstallPromptResult =
	| {
			outcome: InstallPromptOutcome;
	  }
	| {
			outcome: "unavailable";
	  };

function isIosLikeUserAgent(
	userAgent: string,
	platform: string,
	maxTouchPoints: number,
) {
	return (
		/iphone|ipad|ipod/i.test(userAgent) ||
		(platform === "MacIntel" && maxTouchPoints > 1)
	);
}

function isAndroidUserAgent(userAgent: string) {
	return /android/i.test(userAgent);
}

function isStandaloneMode() {
	const isStandaloneDisplayMode = window.matchMedia(
		"(display-mode: standalone)",
	).matches;
	const navigatorWithStandalone = navigator as Navigator & {
		standalone?: boolean;
	};

	return isStandaloneDisplayMode || navigatorWithStandalone.standalone === true;
}

export function useInstallApp() {
	const [deferredPrompt, setDeferredPrompt] =
		React.useState<BeforeInstallPromptEvent | null>(null);
	const [isInstalled, setIsInstalled] = React.useState(false);

	const platform = React.useMemo(() => {
		if (typeof window === "undefined") {
			return {
				isAndroid: false,
				isIosLike: false,
			};
		}

		return {
			isAndroid: isAndroidUserAgent(window.navigator.userAgent),
			isIosLike: isIosLikeUserAgent(
				window.navigator.userAgent,
				window.navigator.platform,
				window.navigator.maxTouchPoints,
			),
		};
	}, []);

	React.useEffect(() => {
		const standaloneMedia = window.matchMedia("(display-mode: standalone)");

		const syncInstalledState = () => {
			setIsInstalled(isStandaloneMode());
		};

		const handleBeforeInstallPrompt = (event: Event) => {
			const installEvent = event as BeforeInstallPromptEvent;
			installEvent.preventDefault();
			setDeferredPrompt(installEvent);
		};

		const handleAppInstalled = () => {
			setDeferredPrompt(null);
			setIsInstalled(true);
		};

		syncInstalledState();

		window.addEventListener(
			"beforeinstallprompt",
			handleBeforeInstallPrompt as EventListener,
		);
		window.addEventListener("appinstalled", handleAppInstalled);
		standaloneMedia.addEventListener("change", syncInstalledState);

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt as EventListener,
			);
			window.removeEventListener("appinstalled", handleAppInstalled);
			standaloneMedia.removeEventListener("change", syncInstalledState);
		};
	}, []);

	const promptInstall =
		React.useCallback(async (): Promise<InstallPromptResult> => {
			if (!deferredPrompt) {
				return { outcome: "unavailable" };
			}

			await deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			setDeferredPrompt(null);

			return { outcome };
		}, [deferredPrompt]);

	return {
		canPromptInstall:
			platform.isAndroid && !isInstalled && deferredPrompt !== null,
		isAndroid: platform.isAndroid,
		isInstalled,
		isIosLike: platform.isIosLike,
		promptInstall,
		shouldShowInstallCard:
			!isInstalled &&
			(platform.isIosLike || (platform.isAndroid && deferredPrompt !== null)),
	};
}
