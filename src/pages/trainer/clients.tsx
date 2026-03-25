import ClientsList from "@/components/clients/list";
import CreateClientSheet from "@/components/clients/sheet/create-client";
import PageTitle from "@/components/core/page-title";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

const actions = <CreateClientSheet />

export default function TrainerClientsPage() {

  return <div className="space-y-6">
    <PageTitle title="Alunos" description="Convide e gerencie seus alunos" actions={actions} />
    <Suspense fallback={<Spinner className="size-8" />}>
      <ClientsList />
    </Suspense>
  </div >
}