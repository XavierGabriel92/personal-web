import {
	type Locale,
	differenceInDays,
	differenceInWeeks,
	format,
	formatDistance,
	parseISO,
	subDays,
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

	// Map locale strings to date-fns locale objects
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

export const formatRelativeDate = (dateString: string) => {
	return formatDistance(subDays(new Date(dateString), 3), new Date(), {
		addSuffix: true,
		locale: ptBR,
	});
};
