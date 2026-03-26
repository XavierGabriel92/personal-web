import PageTitle from "@/components/core/page-title";
import TrainerAnamnesisPage from "./trainer-anamnesis";

export default function AnamnesisLayoutPage() {
  return (
    <div>
      <PageTitle
        title="Anamneses"
        description="Gerencie seus formulários de anamnese"
      />
      <TrainerAnamnesisPage />
    </div>
  );
}
