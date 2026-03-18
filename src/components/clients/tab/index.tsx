import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const getTabFromPath = (pathname: string) => {
  const lastSegment = pathname.split('/').pop();
  switch (lastSegment) {
    case "program":
      return "tab-2";
    case "measurements":
      return "tab-3";
    default:
      return "tab-1";
  }
}

export default function ClientsTab({ clientId }: { clientId: string }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const onTabChange = (value: string) => {
    navigate({ to: `/trainer/clients/${clientId}/${value}` });
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
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
        {/* <TabsTrigger
          value="tab-3"
          onClick={() => onTabChange("measurements")}
        >
          Medidas corporais
        </TabsTrigger> */}
      </TabsList>
    </Tabs>
  )
}