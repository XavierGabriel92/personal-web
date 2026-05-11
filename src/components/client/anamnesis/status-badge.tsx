import { Badge } from "@/components/ui/badge";
import type { GetApiClientMeAnamnesisByClientAnamnesisId200StatusEnumKey } from "@/gen/types/GetApiClientMeAnamnesisByClientAnamnesisId";

interface AnamnesisStatusBadgeProps {
	status: GetApiClientMeAnamnesisByClientAnamnesisId200StatusEnumKey;
}

export function AnamnesisStatusBadge({
	status,
}: AnamnesisStatusBadgeProps) {
	switch (status) {
		case "PENDING":
			return <Badge variant="warning">Pendente</Badge>;
		case "AWAITING_CONFIRMATION":
			return <Badge variant="secondary">Aguardando confirmação</Badge>;
		case "FINISHED":
			return <Badge variant="success">Finalizada</Badge>;
		default:
			return <Badge variant="outline">{status}</Badge>;
	}
}
