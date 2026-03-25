import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const getTabFromPath = (pathname: string) => {
  const lastSegment = pathname.split('/').pop();
  switch (lastSegment) {
    case "templates":
      return "tab-2";
    default:
      return "tab-1";
  }
};

export default function AnamnesisTab() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const onTabChange = (value: string) => {
    navigate({ to: `/trainer/anamnesis/${value}` });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="tab-1" onClick={() => onTabChange("")}>
          Minhas anamneses
        </TabsTrigger>
        <TabsTrigger value="tab-2" onClick={() => onTabChange("templates")}>
          Anamneses prontas
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
