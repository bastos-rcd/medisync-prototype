import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <MobileNav />
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-border bg-card">
          <h1 className="text-2xl font-heading font-bold text-foreground">{title}</h1>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
