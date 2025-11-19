import { ModeToggle } from "@/components/theme-provider/mode-toggle";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	Bell,
	HelpCircle,
} from "lucide-react";

export default function TrainerHeader() {
	return (
		<header className="sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-4 border-b bg-background px-5 md:px-10">
			<SidebarTrigger className="-ml-1 block lg:hidden" />

			<div className="flex flex-1 items-center gap-4">
				{/* Search Bar */}
				<SearchInput placeholder="Pesquisar um aluno..." />
			</div>

			{/* Utility Icons */}
			<div className="flex items-center gap-2">
				<ModeToggle />
				<Button variant="ghost" size="icon" className="h-9 w-9">
					<HelpCircle className="h-4 w-4" />
					<span className="sr-only">Ajuda</span>
				</Button>
				<Button variant="ghost" size="icon" className="h-9 w-9">
					<Bell className="h-4 w-4" />
					<span className="sr-only">Notificações</span>
				</Button>
				{/* <Button variant="ghost" size="icon" className="h-9 w-9">
					<Settings className="h-4 w-4" />
					<span className="sr-only">Settings</span>
				</Button> */}
			</div>
		</header>
	);
}
