import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarLargeScreenTrigger,
} from "@/components/ui/sidebar";
import {
	BookA,
	Dumbbell,
	Home,
	Users,
} from "lucide-react";
import type * as React from "react";
import { NavMain } from "./nav-main";
import { NavPlan } from "./nav-plan";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

// Trainer dashboard navigation data
const data = {
	user: {
		name: "Trainer",
		email: "trainer@example.com",
		avatar: "",
	},
	teams: [
		{
			name: "Personal Trainer",
			logo: Home,
			plan: "Professional",
		},
	],
	navMain: [
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
		// {
		// 	title: "Settings",
		// 	url: "/trainer/settings",
		// 	icon: Settings,
		// 	items: [
		// 		{
		// 			title: "General",
		// 			url: "/trainer/settings/general",
		// 		},
		// 		{
		// 			title: "Billing",
		// 			url: "/trainer/settings/billing",
		// 		},
		// 		{
		// 			title: "Notifications",
		// 			url: "/trainer/settings/notifications",
		// 		},
		// 	],
		// },
	]
};

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" className="relative" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />

			</SidebarContent>
			<SidebarFooter>
				<NavPlan />
				<NavUser user={data.user} />
			</SidebarFooter>
			<div className="absolute top-[50%] right-[-30px] translate-y-[-50%] z-20 hidden sm:block">
				<SidebarLargeScreenTrigger />
			</div>
		</Sidebar>
	);
}
