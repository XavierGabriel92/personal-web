import axios from "axios";

import type {
	RequestConfig,
	ResponseConfig,
	ResponseErrorConfig,
} from "@kubb/plugin-client/clients/axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

const personalClient = async <TData, TError = unknown, TVariables = unknown>(
	config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> => {
	try {
		const response = await axiosInstance({
			...config,
			withCredentials: true,
		});

		return {
			data: response.data,
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
		};
	} catch (error: unknown) {
		const axiosError = error as {
			response?: { status?: number };
			code?: string;
		};

		if (
			axiosError?.response?.status === 401 ||
			axiosError?.code === "ERR_NETWORK"
		) {
			window.location.href = "/";
		}

		throw error;
	}
};

export type { RequestConfig, ResponseConfig, ResponseErrorConfig };

export default personalClient;
