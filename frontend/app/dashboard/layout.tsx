import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "20rem",
					"--sidebar-width-mobile": "15rem",
				} as React.CSSProperties
			}
		>
			<AppSidebar />
			<main>
				{children}
			</main>
		</SidebarProvider>
	);
}
