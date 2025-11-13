import {
	Bell,
	Grid3x3,
	HelpCircle,
	Plus,
	Search,
	Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TrainerHeader() {
	return (
		<header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
			<SidebarTrigger className="-ml-1" />

			<div className="flex flex-1 items-center gap-4">
				{/* Logo/Brand - can be customized */}
				<div className="hidden md:flex items-center">
					<span className="text-lg font-semibold">T Tavi</span>
				</div>

				{/* Search Bar */}
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search..."
						className="w-full bg-muted/50 pl-9 h-9"
					/>
				</div>
			</div>

			{/* Utility Icons */}
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="icon" className="h-9 w-9">
					<Grid3x3 className="h-4 w-4" />
					<span className="sr-only">Grid</span>
				</Button>
				<Button variant="ghost" size="icon" className="h-9 w-9">
					<HelpCircle className="h-4 w-4" />
					<span className="sr-only">Help</span>
				</Button>
				<Button variant="ghost" size="icon" className="h-9 w-9">
					<Bell className="h-4 w-4" />
					<span className="sr-only">Notifications</span>
				</Button>
				<Button variant="ghost" size="icon" className="h-9 w-9">
					<Settings className="h-4 w-4" />
					<span className="sr-only">Settings</span>
				</Button>
				<Button variant="ghost" size="icon" className="h-9 w-9">
					<Plus className="h-4 w-4" />
					<span className="sr-only">Add</span>
				</Button>
			</div>
		</header>
	);
}
