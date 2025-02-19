import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Loader,
  ChartLine,
  Radar,
  Table
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ClerkLoading, ClerkLoaded, UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from './ui/button';

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: ChartLine,
  },
  {
    title: 'Radar',
    url: '/scan',
    icon: Radar,
  },
  {
    title: 'Tables',
    url: '/tables',
    icon: Table,
  },
  {
    title: 'Search',
    url: '#',
    icon: Search,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Deep 3D</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
                    pointerEvents: 'initial',
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
