import type fetch from "@/lib/client.ts";
import type {
	PostApiClientByIdChangeInviteEmailMutationRequest,
	PostApiClientByIdChangeInviteEmailMutationResponse,
	PostApiClientByIdChangeInviteEmailPathParams,
	PostApiClientByIdChangeInviteEmail400,
	PostApiClientByIdChangeInviteEmail404,
	PostApiClientByIdChangeInviteEmail409,
} from "../types/PostApiClientByIdChangeInviteEmail.ts";
import type { RequestConfig, ResponseErrorConfig } from "@/lib/client.ts";
import type { UseMutationOptions, UseMutationResult, QueryClient } from "@tanstack/react-query";
import { postApiClientByIdChangeInviteEmail } from "../clients/postApiClientByIdChangeInviteEmail.ts";
import { mutationOptions, useMutation } from "@tanstack/react-query";

export const postApiClientByIdChangeInviteEmailMutationKey = () =>
	[{ url: "/api/client/:id/change-invite-email" }] as const;

export type PostApiClientByIdChangeInviteEmailMutationKey = ReturnType<
	typeof postApiClientByIdChangeInviteEmailMutationKey
>;

export function postApiClientByIdChangeInviteEmailMutationOptions(
	config: Partial<RequestConfig<PostApiClientByIdChangeInviteEmailMutationRequest>> & {
		client?: typeof fetch;
	} = {},
) {
	const mutationKey = postApiClientByIdChangeInviteEmailMutationKey();
	return mutationOptions<
		PostApiClientByIdChangeInviteEmailMutationResponse,
		ResponseErrorConfig<
			| PostApiClientByIdChangeInviteEmail400
			| PostApiClientByIdChangeInviteEmail404
			| PostApiClientByIdChangeInviteEmail409
		>,
		{
			id: PostApiClientByIdChangeInviteEmailPathParams["id"];
			data: PostApiClientByIdChangeInviteEmailMutationRequest;
		},
		typeof mutationKey
	>({
		mutationKey,
		mutationFn: async ({ id, data }) => {
			return postApiClientByIdChangeInviteEmail(id, data, config);
		},
	});
}

/**
 * {@link /api/client/:id/change-invite-email}
 */
export function usePostApiClientByIdChangeInviteEmail<TContext>(
	options: {
		mutation?: UseMutationOptions<
			PostApiClientByIdChangeInviteEmailMutationResponse,
			ResponseErrorConfig<
				| PostApiClientByIdChangeInviteEmail400
				| PostApiClientByIdChangeInviteEmail404
				| PostApiClientByIdChangeInviteEmail409
			>,
			{
				id: PostApiClientByIdChangeInviteEmailPathParams["id"];
				data: PostApiClientByIdChangeInviteEmailMutationRequest;
			},
			TContext
		> & { client?: QueryClient };
		client?: Partial<RequestConfig<PostApiClientByIdChangeInviteEmailMutationRequest>> & {
			client?: typeof fetch;
		};
	} = {},
) {
	const { mutation = {}, client: config = {} } = options ?? {};
	const { client: queryClient, ...mutationOptionsRest } = mutation;
	const mutationKey =
		mutationOptionsRest.mutationKey ?? postApiClientByIdChangeInviteEmailMutationKey();

	const baseOptions = postApiClientByIdChangeInviteEmailMutationOptions(config) as UseMutationOptions<
		PostApiClientByIdChangeInviteEmailMutationResponse,
		ResponseErrorConfig<
			| PostApiClientByIdChangeInviteEmail400
			| PostApiClientByIdChangeInviteEmail404
			| PostApiClientByIdChangeInviteEmail409
		>,
		{
			id: PostApiClientByIdChangeInviteEmailPathParams["id"];
			data: PostApiClientByIdChangeInviteEmailMutationRequest;
		},
		TContext
	>;

	return useMutation<
		PostApiClientByIdChangeInviteEmailMutationResponse,
		ResponseErrorConfig<
			| PostApiClientByIdChangeInviteEmail400
			| PostApiClientByIdChangeInviteEmail404
			| PostApiClientByIdChangeInviteEmail409
		>,
		{
			id: PostApiClientByIdChangeInviteEmailPathParams["id"];
			data: PostApiClientByIdChangeInviteEmailMutationRequest;
		},
		TContext
	>(
		{
			...baseOptions,
			mutationKey,
			...mutationOptionsRest,
		},
		queryClient,
	) as UseMutationResult<
		PostApiClientByIdChangeInviteEmailMutationResponse,
		ResponseErrorConfig<
			| PostApiClientByIdChangeInviteEmail400
			| PostApiClientByIdChangeInviteEmail404
			| PostApiClientByIdChangeInviteEmail409
		>,
		{
			id: PostApiClientByIdChangeInviteEmailPathParams["id"];
			data: PostApiClientByIdChangeInviteEmailMutationRequest;
		},
		TContext
	>;
}
