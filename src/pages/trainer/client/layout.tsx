import EditClientSheet from "@/components/clients/sheet/edit-client";
import ClientsTab from "@/components/clients/tab";
import PageTitle from "@/components/core/page-title";

interface TrainerLayoutClientProps {
  clientId: string;
}

const mockClient = {
  id: "5",
  name: "Carlos Ferreira",
  email: "carlos.ferreira@example.com",
  phone: "(11) 94321-0987",
  status: "pending",
  createdAt: "2024-03-25",
}

export default function TrainerLayoutClient({ clientId }: TrainerLayoutClientProps) {
  return <div className="space-y-6 w-full">
    <PageTitle title={mockClient.name} description={mockClient.email} actions={<EditClientSheet />} />
    <ClientsTab clientId={clientId} />
  </div>
} 