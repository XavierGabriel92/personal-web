import PageTitle from "@/components/core/page-title";
import ProgramTab from "@/components/routine/tab";

export default function ProgramsLayoutPage() {
  return <div>
    <PageTitle title="Programas"
      description="Organize todos seus programas e treinos"
    />
    <ProgramTab />
  </div>
}