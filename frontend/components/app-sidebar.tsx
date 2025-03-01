"use client";

import { Search, Settings, Loader, Radar, Spline, Orbit } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Image from "next/image";
import TokenStats from "./sidebar/tokenStats";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Menu items.
const items = [
	{
		title: "Solar System",
		url: "/dashboard",
		icon: Orbit,
	},
	{
		title: "Whale Radar",
		url: "/whales",
		icon: Radar,
	},
	{
		title: "Asset Correlation",
		url: "/correlation",
		icon: Spline,
	},
	{
		title: "Wallet Explorer",
		url: "search",
		icon: Search,
	},
];

export function AppSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>
						<Link href="/">
							<div className="flex items-center space-x-2 mb-2">
								<Image
									src="/adak.png"
									alt="logo"
									width={19}
									height={19}
								/>
								<p>ADA Kosmos</p>
							</div>
						</Link>
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => {
								const isActive =
									pathname === item.url ||
									(item.url !== "#" &&
										pathname?.startsWith(item.url));

								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											className={`[&>svg]:size-5 ${
												isActive
													? "bg-amber-500/10 text-amber-500"
													: ""
											}`}
										>
											<Link href={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarSeparator />
				<SidebarSeparator />
				<SidebarRail />
				<SidebarGroupContent className="group-data-[collapsible=icon]:hidden">
					<TokenStats />
				</SidebarGroupContent>
				<SidebarFooter>
					<Button
						variant="outline"
						className="absolute bottom-0 right-0 mr-3 mb-3 rounded-md p-0 w-6 h-6 flex items-center justify-center"
					>
						<ClerkLoading>
							<Loader className="h-6 w-6 text-muted-foreground animate-spin" />
						</ClerkLoading>
						<ClerkLoaded>
							<UserButton
								appearance={{
									elements: {
										userButtonPopoverCard: {
											pointerEvents: "initial",
										},
									},
								}}
							/>
						</ClerkLoaded>
					</Button>
				</SidebarFooter>
			</SidebarContent>
		</Sidebar>
	);
}
