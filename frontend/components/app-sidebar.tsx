import { Search, Settings, Loader, Radar, Table, Orbit } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
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
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "./ui/button";
import Image from "next/image";

// Menu items.
const items = [
	{
		title: "Solar System",
		url: "/dashboard",
		icon: Orbit,
	},
	{
		title: "Radar",
		url: "/scan",
		icon: Radar,
	},
	{
		title: "Tables",
		url: "/tables",
		icon: Table,
	},
	{
		title: "Search",
		url: "#",
		icon: Search,
	},
	{
		title: "Settings",
		url: "#",
		icon: Settings,
	},
];

export function AppSidebar() {
	return (
		<Sidebar collapsible="icon">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>
						<div className="flex items-center space-x-2 mb-2">
							<Image
								src="/adak.png"
								alt="logo"
								width={19}
								height={19}
							/>
							<p>ADA Kosmos</p>
						</div>
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className="[&>svg]:size-5"
									>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarSeparator />
				<SidebarRail />
				<ThemeToggle />
				<Button
					variant="outline"
					className="absolute bottom-0 right-0 mr-4 mb-4 rounded-md p-0 w-10 h-10 flex items-center justify-center"
				>
					<ClerkLoading>
						<Loader className="h-5 w-5 text-muted-foreground animate-spin" />
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
			</SidebarContent>
		</Sidebar>
	);
}
