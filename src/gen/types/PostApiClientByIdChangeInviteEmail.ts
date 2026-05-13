/**
 * Hand-maintained to match POST /api/client/:id/change-invite-email (regenerate via Kubb when convenient).
 */

import type { PutApiClientById200 } from "./PutApiClientById.ts";

export type PostApiClientByIdChangeInviteEmailPathParams = {
	id: string;
};

export type PostApiClientByIdChangeInviteEmail400 = {
	message: string;
};

export type PostApiClientByIdChangeInviteEmail404 = {
	message: string;
};

export type PostApiClientByIdChangeInviteEmail409 = {
	message: string;
};

export type PostApiClientByIdChangeInviteEmailMutationRequest = {
	email: string;
};

export type PostApiClientByIdChangeInviteEmailMutationResponse = PutApiClientById200;

export type PostApiClientByIdChangeInviteEmailMutation = {
	Response: PostApiClientByIdChangeInviteEmailMutationResponse;
	Request: PostApiClientByIdChangeInviteEmailMutationRequest;
	PathParams: PostApiClientByIdChangeInviteEmailPathParams;
	Errors:
		| PostApiClientByIdChangeInviteEmail400
		| PostApiClientByIdChangeInviteEmail404
		| PostApiClientByIdChangeInviteEmail409;
};
