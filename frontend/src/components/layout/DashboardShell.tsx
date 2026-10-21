import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 pb-24 focus:outline-none md:pb-0">
          <div className="mx-auto w-full max-w-6xl p-5 sm:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
