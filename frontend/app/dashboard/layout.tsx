import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '25vw',
          '--sidebar-width-mobile': '15rem',
        } as React.CSSProperties
      }
    >
      <div className='flex h-screen w-full'>
        <AppSidebar />
        <main className='flex-1 min-w-0'>{children}</main>
      </div>
    </SidebarProvider>
  );
}
