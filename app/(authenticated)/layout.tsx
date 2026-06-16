import Sidebar from "../components/Sidebar/Sidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-surface-primary">
          {children}
        </main>
      </div>
    </div>
  );
}
