import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const getTabFromPath = (pathname: string) => {
	const lastSegment = pathname.split("/").pop();
	switch (lastSegment) {
		case "workout-session":
			return "tab-2";
		case "measurements":
			return "tab-3";
		case "weight-evolution":
			return "tab-4";
		case "program-history":
			return "tab-5";
		case "anamnesis":
			return "tab-6";
		default:
			return "tab-1";
	}
};

export default function ClientsTab({ clientId }: { clientId: string }) {
	const location = useLocation();
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState(() =>
		getTabFromPath(location.pathname),
	);

	useEffect(() => {
		setActiveTab(getTabFromPath(location.pathname));
	}, [location.pathname]);

	const onTabChange = (value: string) => {
		navigate({ to: `/trainer/clients/${clientId}/${value}` });
	};

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab}>
			<TabsList>
				<TabsTrigger value="tab-1" onClick={() => onTabChange("overview")}>
					Resumo
				</TabsTrigger>
				<TabsTrigger
					value="tab-2"
					onClick={() => onTabChange("workout-session")}
				>
					Treinos realizados
				</TabsTrigger>
				{/* <TabsTrigger
          value="tab-3"
          onClick={() => onTabChange("measurements")}
        >
          Medidas corporais
        </TabsTrigger> */}
				<TabsTrigger
					value="tab-4"
					onClick={() => onTabChange("weight-evolution")}
				>
					Evolução de Carga
				</TabsTrigger>
				<TabsTrigger
					value="tab-5"
					onClick={() => onTabChange("program-history")}
				>
					Histórico de programas
				</TabsTrigger>
				<TabsTrigger value="tab-6" onClick={() => onTabChange("anamnesis")}>
					Anamnese
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
