import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { useTheme } from ".";

function ThemeOption({
	icon,
	value,
	isActive,
	onClick,
}: {
	icon: ReactNode;
	value: string;
	isActive?: boolean;
	onClick: (value: string) => void;
}) {
	return (
		<button
			type="button"
			className={cn(
				"relative flex size-8 cursor-pointer items-center justify-center rounded-full transition-[color] [&_svg]:size-4",
				isActive
					? "text-zinc-950 dark:text-zinc-50"
					: "text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50",
			)}
			aria-pressed={isActive}
			aria-label={`Switch to ${value} theme`}
			onClick={() => onClick(value)}
		>
			{icon}

			{isActive && (
				<motion.div
					layoutId="theme-option"
					transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
					className="absolute inset-0 rounded-full border border-zinc-200 dark:border-zinc-700"
				/>
			)}
		</button>
	);
}

const THEME_OPTIONS = [
	{
		icon: <Monitor />,
		value: "system",
	},
	{
		icon: <Sun />,
		value: "light",
	},
	{
		icon: <Moon />,
		value: "dark",
	},
] as const;

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	const isMounted = useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	);

	if (!isMounted) {
		return <div className="flex h-8 w-24 shrink-0" aria-hidden />;
	}

	return (
		<motion.fieldset
			key={String(isMounted)}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
			className="m-0 inline-flex min-w-0 shrink-0 items-center overflow-hidden rounded-full border-0 bg-white p-0 ring-1 ring-zinc-200 ring-inset dark:bg-zinc-950 dark:ring-zinc-700"
		>
			<legend className="sr-only">Theme</legend>
			{THEME_OPTIONS.map((option) => (
				<ThemeOption
					key={option.value}
					icon={option.icon}
					value={option.value}
					isActive={theme === option.value}
					onClick={(v) => setTheme(v as typeof theme)}
				/>
			))}
		</motion.fieldset>
	);
}
