import Sidebar from "@/components/Sidebar";
import QuickNotes from "@/components/QuickNotes";
import { AppProvider } from "@/context/AppContext";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <Sidebar />
      <main className="ml-56 min-h-screen p-8">{children}</main>
      <QuickNotes />
    </AppProvider>
  );
}
