import PageTitle from "@/components/core/page-title";
import AnamnesisTab from "@/components/anamnesis/tab";

export default function AnamnesisLayoutPage() {
  return (
    <div>
      <PageTitle
        title="Anamneses"
        description="Gerencie seus formulários de anamnese"
      />
      <AnamnesisTab />
    </div>
  );
}
