"use client";

import {
	BarChart3,
	Calendar,
	CreditCard,
	FileText,
	Home,
	Settings,
	Shield,
	Users,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

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
			url: "/trainer",
			icon: Home,
			isActive: true,
		},
		{
			title: "Clients",
			url: "/trainer/clients",
			icon: Users,
		},
		{
			title: "Workouts",
			url: "/trainer/workouts",
			icon: Calendar,
		},
		{
			title: "Analytics",
			url: "/trainer/analytics",
			icon: BarChart3,
		},
		{
			title: "Settings",
			url: "/trainer/settings",
			icon: Settings,
			items: [
				{
					title: "General",
					url: "/trainer/settings/general",
				},
				{
					title: "Billing",
					url: "/trainer/settings/billing",
				},
				{
					title: "Notifications",
					url: "/trainer/settings/notifications",
				},
			],
		},
	],
	projects: [
		{
			name: "Subscriptions",
			url: "/trainer/subscriptions",
			icon: CreditCard,
		},
		{
			name: "Reports",
			url: "/trainer/reports",
			icon: FileText,
		},
		{
			name: "Security",
			url: "/trainer/security",
			icon: Shield,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
