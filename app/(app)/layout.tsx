import Sidebar from "@/components/Sidebar";
import QuickNotes from "@/components/QuickNotes";
import TopBar from "@/components/TopBar";
import { AppProvider } from "@/context/AppContext";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <Sidebar />
      <div className="ml-56 min-h-screen">
        <TopBar />
        <main className="p-8">{children}</main>
      </div>
      <QuickNotes />
    </AppProvider>
  );
}
