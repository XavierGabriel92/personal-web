import {
	formatDuration as formatClientDuration,
	formatRelativeDate as formatClientRelativeDate,
	formatWeekdayShortPtBr,
} from "@/lib/client-portal";
import { useMemo } from "react";

export function useRelativeDate(value: string | Date) {
	return useMemo(() => formatClientRelativeDate(value), [value]);
}

export const formatRelativeDate = formatClientRelativeDate;
export const formatDuration = formatClientDuration;
export { formatWeekdayShortPtBr };
