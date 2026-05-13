import fetch from "@/lib/client.ts";
import type {
	PostApiClientByIdChangeInviteEmailMutationRequest,
	PostApiClientByIdChangeInviteEmailMutationResponse,
	PostApiClientByIdChangeInviteEmailPathParams,
	PostApiClientByIdChangeInviteEmail400,
	PostApiClientByIdChangeInviteEmail404,
	PostApiClientByIdChangeInviteEmail409,
} from "../types/PostApiClientByIdChangeInviteEmail.ts";
import type { RequestConfig, ResponseErrorConfig } from "@/lib/client.ts";

function getPostApiClientByIdChangeInviteEmailUrl(
	id: PostApiClientByIdChangeInviteEmailPathParams["id"],
) {
	return { method: "POST", url: `/api/client/${id}/change-invite-email` as const };
}

export async function postApiClientByIdChangeInviteEmail(
	id: PostApiClientByIdChangeInviteEmailPathParams["id"],
	data: PostApiClientByIdChangeInviteEmailMutationRequest,
	config: Partial<RequestConfig<PostApiClientByIdChangeInviteEmailMutationRequest>> & {
		client?: typeof fetch;
	} = {},
) {
	const { client: request = fetch, ...requestConfig } = config;

	const res = await request<
		PostApiClientByIdChangeInviteEmailMutationResponse,
		ResponseErrorConfig<
			| PostApiClientByIdChangeInviteEmail400
			| PostApiClientByIdChangeInviteEmail404
			| PostApiClientByIdChangeInviteEmail409
		>,
		PostApiClientByIdChangeInviteEmailMutationRequest
	>({
		method: "POST",
		url: getPostApiClientByIdChangeInviteEmailUrl(id).url.toString(),
		data,
		...requestConfig,
	});
	return res.data;
}
