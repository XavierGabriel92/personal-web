"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { type LucideIcon, MoreHorizontal } from "lucide-react";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

export function NavProjects({
	projects,
}: {
	projects: {
		name: string;
		url: string;
		icon: LucideIcon;
	}[];
}) {
	const { isMobile } = useSidebar();
	const location = useLocation();

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Shortcuts</SidebarGroupLabel>
			<SidebarMenu>
				{projects.map((item) => {
					const isActive = location.pathname === item.url;
					return (
						<SidebarMenuItem key={item.name}>
							<SidebarMenuButton asChild isActive={isActive}>
								<Link to={item.url}>
									<item.icon />
									<span>{item.name}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
