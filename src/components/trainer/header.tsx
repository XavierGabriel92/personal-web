import { ModeToggle } from "@/components/theme-provider/mode-toggle";
import { SearchInput } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetApiClients } from "@/gen/hooks/useGetApiClients";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

function ClientSearchList({ search }: { search: string }) {
	const { data } = useGetApiClients();
	const navigate = useNavigate();
	const clients = (data?.clients ?? []).filter((c) =>
		c.name.toLowerCase().includes(search.toLowerCase())
	);

	if (!search) return null;

	return (
		<div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-md border bg-popover shadow-md">
			{clients.length === 0 ? (
				<p className="p-3 text-sm text-muted-foreground">Nenhum aluno encontrado</p>
			) : (
				clients.slice(0, 6).map((c) => (
					<button
						type="button"
						key={c.id}
						className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
						onClick={() =>
							navigate({ to: "/trainer/clients/$clientId/overview", params: { clientId: c.id } })
						}
					>
						{c.name}
					</button>
				))
			)}
		</div>
	);
}

export default function TrainerHeader() {
	const [search, setSearch] = useState("");

	return (
		<header className="sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-4 border-b bg-background px-5 md:px-10">
			<SidebarTrigger className="-ml-1 block lg:hidden" />

			<div className="flex flex-1 items-center gap-4">
				<div className="relative w-full max-w-sm">
					<SearchInput
						placeholder="Pesquisar um aluno..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onBlur={() => setTimeout(() => setSearch(""), 200)}
					/>
					<ClientSearchList search={search} />
				</div>
			</div>

			<div className="flex items-center gap-2">
				<ModeToggle />
				{/* <Button variant="ghost" size="icon" className="h-9 w-9">
					<HelpCircle className="h-4 w-4" />
					<span className="sr-only">Ajuda</span>
				</Button>
				<Button variant="ghost" size="icon" className="h-9 w-9">
					<Bell className="h-4 w-4" />
					<span className="sr-only">Notificações</span>
				</Button> */}
				{/* <Button variant="ghost" size="icon" className="h-9 w-9">
					<Settings className="h-4 w-4" />
					<span className="sr-only">Settings</span>
				</Button> */}
			</div>
		</header>
	);
}
