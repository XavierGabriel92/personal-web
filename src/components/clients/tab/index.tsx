import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

export default function ClientsTab({ clientId }: { clientId: string }) {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultTab = () => {
    const lastSegment = location.pathname.split('/').pop();
    switch (lastSegment) {
      case "program":
        return "tab-2";
      case "measurements":
        return "tab-3";
      case "settings":
        return "tab-4";
      default:
        return "tab-1";
    }
  }

  const onTabChange = (value: string) => {
    navigate({ to: `/trainer/clients/${clientId}/${value}` });
  }

  return (
    <Tabs defaultValue={defaultTab()} >
      <TabsList>
        <TabsTrigger
          value="tab-1"
          onClick={() => onTabChange("overview")}
        >
          Resumo
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          onClick={() => onTabChange("program")}
        >
          Programa
        </TabsTrigger>
        <TabsTrigger
          value="tab-3"
          onClick={() => onTabChange("measurements")}
        >
          Medidas
        </TabsTrigger>
        <TabsTrigger
          value="tab-4"
          onClick={() => onTabChange("settings")}
        >
          Configurações
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}