import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SelectedTokenProvider } from '@/contexts/SelectedTokenContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SelectedTokenProvider>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </SelectedTokenProvider>
  );
}
