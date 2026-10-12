import { RequireAuth } from '@/components/layout/RequireAuth';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RequireAuth>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar className="flex-shrink-0" />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </RequireAuth>
    </>
  );
}