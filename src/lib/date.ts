import {
	type Locale,
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	differenceInWeeks,
	format,
	isSameDay,
	parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";

// TODO: CHECK WHEN INTEGRATE TO BACKEND
const parseLocalDate = (dateStr: string): Date => {
	const trimmed = dateStr.trim();
	if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
		// YYYY-MM-DD format - parse as local date to avoid UTC conversion
		const [year, month, day] = trimmed.split("-").map(Number);
		return new Date(year, month - 1, day);
	}
	return parseISO(trimmed);
};

export const calculateProgramDuration = (
	fromDate: string,
	programExpiration: string,
): string => {
	const start = parseLocalDate(fromDate);
	const end = parseLocalDate(programExpiration);
	const totalDays = differenceInDays(end, start);
	const weeks = differenceInWeeks(end, start);
	const remainingDays = totalDays % 7;

	const parts: string[] = [];

	if (weeks > 0) {
		parts.push(`${weeks} ${weeks === 1 ? "semana" : "semanas"}`);
	}

	if (remainingDays > 0) {
		parts.push(`${remainingDays} ${remainingDays === 1 ? "dia" : "dias"}`);
	}

	if (parts.length === 0) {
		return "0 dias";
	}

	return parts.join(" e ");
};

export const formatDateToLocaleString = (
	date: string,
	locale = "pt-BR",
): string => {
	const dateObj = parseLocalDate(date);
	const localeMap: Record<string, Locale> = {
		"pt-BR": ptBR,
	};

	const dateFnsLocale = localeMap[locale] || ptBR;

	return format(dateObj, "dd/MM/yyyy", { locale: dateFnsLocale });
};

export const formatDateToText = (date: string): string => {
	const dateObj = parseLocalDate(date);
	return format(dateObj, "d MMM, yyyy", { locale: ptBR });
};

export const formatRelativeDate = (date: string) => {
	const dateObj = new Date(date);
	const now = new Date();
	const hoursDiff = Math.abs(differenceInHours(now, dateObj));

	if (hoursDiff >= 24) {
		const dateObj = parseLocalDate(date);
		return format(dateObj, "EEE, d MMM, yyyy", { locale: ptBR });
	}

	if (!isSameDay(dateObj, now)) {
		const hour = format(dateObj, "HH:mm", { locale: ptBR });
		return `Ontem às ${hour}`;
	}

	if (hoursDiff >= 1) {
		return `${hoursDiff}h atrás`;
	}

	const minutesDiff = Math.abs(differenceInMinutes(now, dateObj));
	return `${minutesDiff}min atrás`;
};

export const calculateWeeksFromDate = (startDate: string): number => {
	const start = parseLocalDate(startDate);
	const now = new Date();
	const weeks = differenceInWeeks(now, start);
	// Add 1 because we want "Semana 1" for the first week, not "Semana 0"
	return Math.max(1, weeks + 1);
};
