import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarLargeScreenTrigger,
} from "@/components/ui/sidebar";
import { useCachedSession } from "@/hooks/auth";
import {
	BarChart2,
	BookA,
	Dumbbell,
	Home,
	Users,
} from "lucide-react";
import type * as React from "react";
import { NavMain } from "./nav-main";
import { NavPlan } from "./nav-plan";
import { NavUser } from "./nav-user";

const navMain = [
	{
		title: "Home",
		url: "/trainer/home",
		icon: Home,
	},
	{
		title: "Alunos",
		url: "/trainer/clients",
		icon: Users,
	},
	{
		title: "Programas",
		url: "/trainer/routines",
		icon: BookA,
	},
	{
		title: "Exercícios",
		url: "/trainer/exercises",
		icon: Dumbbell,
	},
	{
		title: "Analytics",
		url: "/trainer/analytics",
		icon: BarChart2,
	},
];

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { data: session } = useCachedSession();
	const user = {
		name: session?.user.name ?? "",
		email: session?.user.email ?? "",
		avatar: session?.user.image ?? "",
	};

	return (
		<Sidebar collapsible="icon" className="relative" {...props}>
			<SidebarHeader>
				<NavUser user={user} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />

			</SidebarContent>
			<SidebarFooter>
				<NavPlan />
			</SidebarFooter>
			<div className="absolute top-[50%] right-[-30px] translate-y-[-50%] z-20 hidden sm:block">
				<SidebarLargeScreenTrigger />
			</div>
		</Sidebar>
	);
}
